import createHttpError from 'http-errors'
import { Types } from 'mongoose'
import discountModel from '~/models/discount.model'
import { checkDiscountExists, getAllDiscountCodesUnSelect } from '~/models/repositories/discount.repo'
import { findAllProducts } from '~/models/repositories/product.repo'
import { convertToObjectId } from '~/utils'

/*
  1. Create Discount code [Shop/admin]
  2. Get Discount code [User]
  3. Get all Discount codes [Shop/user]
  4. Verify Discount code [user]
  5. Delete Discount code [Shop/admin]
  6. Cancel Discount code [user]
*/
interface Discount {
  discount_name: string
  discount_description: string
  discount_type: string
  discount_value: number
  discount_start_date: Date
  discount_end_date: Date
  discount_code: string
  discount_max_usage: number
  discount_usage_count: number
  discount_users_used: string[]
  discount_max_usage_per_user: number
  discount_min_order_value: number
  discount_shopId: Types.ObjectId
  discount_is_active: boolean
  discount_applies_to: string
  discount_product_ids: string[]
}

class DiscountService {
  static async createDiscountCode(payload: Discount) {
    //TODO: add validation => Check start date and end date
    // const foundDiscount = await discountModel
    //   .findOne({ discount_code: payload.discount_code, discount_shopId: payload.discount_shopId })
    //   .lean()
    const foundDiscount = await checkDiscountExists({
      filter: { discount_code: payload.discount_code, discount_shopId: payload.discount_shopId }
    })

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw createHttpError(400, 'Discount code already exists')
    }

    const newDiscount = await discountModel.create({
      ...payload,
      discount_product_ids: payload.discount_applies_to === 'all' ? [] : payload.discount_product_ids
    })
    if (!newDiscount) {
      throw createHttpError(400, 'Failed to create discount code')
    }

    return newDiscount
  }

  static async updateDiscountCode({ discount_id, payload }: { discount_id: string; payload: Discount }) {
    // const foundDiscount = await discountModel.findById(discount_id).lean()
    const foundDiscount = await checkDiscountExists({ filter: { _id: discount_id } })
    if (!foundDiscount) {
      throw createHttpError(404, 'Discount code not found')
    }

    const updatedDiscount = await discountModel.findByIdAndUpdate(discount_id, payload, {
      new: true,
      runValidators: true
    })
    if (!updatedDiscount) {
      throw createHttpError(400, 'Failed to update discount code')
    }

    return updatedDiscount
  }

  static async getAllDiscountCodesWithProduct({
    shopId,
    discountCode,
    limit,
    page
  }: {
    shopId: string
    discountCode: string
    limit: number
    page: number
  }) {
    // const foundDiscount = await discountModel
    //   .findOne({ discount_code: payload.discount_code, discount_shopId: payload.discount_shopId })
    //   .lean()
    const foundDiscount = await checkDiscountExists({
      filter: { discount_code: discountCode, discount_shopId: convertToObjectId(shopId) }
    })

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw createHttpError(404, 'Discount code not found')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products
    if (discount_applies_to === 'all') {
      // get all products
      products = await findAllProducts({
        limit: limit,
        sort: 'ctime',
        page: page,
        filter: { product_shop: convertToObjectId(shopId), isPublished: true },
        select: ['product_name']
      })
    }

    if (discount_applies_to === 'specific') {
      // get specific products
      products = await findAllProducts({
        limit: limit,
        sort: 'ctime',
        page: page,
        filter: { _id: { $in: discount_product_ids }, isPublished: true },
        select: ['product_name']
      })
    }

    return { products }
  }

  static async getAllDiscountCodesByShop({ shopId, limit, page }: { shopId: string; limit: number; page: number }) {
    const discounts = await getAllDiscountCodesUnSelect({
      limit: limit,
      sort: 'ctime',
      page: page,
      filter: { discount_shopId: convertToObjectId(shopId), discount_is_active: true },
      unSelect: ['discount_product_ids', '__v']
    })
    return discounts
  }

  static async getDiscountAmount({
    code,
    userId,
    shopId,
    products
  }: {
    code: string
    userId: string
    shopId: string
    products: any
  }) {
    // check discount exists
    const foundDiscount = await checkDiscountExists({
      filter: { discount_code: code, discount_shopId: convertToObjectId(shopId) }
    })

    if (!foundDiscount) {
      throw createHttpError(404, 'Discount code not found')
    }

    const {
      discount_max_usage,
      discount_is_active,
      discount_min_order_value,
      discount_max_usage_per_user,
      discount_users_used,
      discount_type
    } = foundDiscount
    // check validation: isactive, maxuses, date
    if (!discount_is_active) {
      throw createHttpError(400, 'Discount code is not active')
    }
    if (discount_max_usage === 0) {
      throw createHttpError(400, 'Discount is reached max usage')
    }
    // check minordervalue
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((total, product) => total + product.product_price * product.product_quantity, 0)
      if (totalOrder < discount_min_order_value) {
        throw createHttpError(400, 'Total order value is less than min order value')
      }
    }
    //...
    if (discount_max_usage_per_user > 0) {
      const userUsedDiscount = discount_users_used.find((user) => user.userId === userId)
      if (userUsedDiscount) {
        if (userUsedDiscount.usageCount >= discount_max_usage_per_user) {
          throw createHttpError(400, 'User has reached max usage per user')
        }
      }
    }
    const amount =
      discount_type === 'fixed_amount'
        ? foundDiscount.discount_value
        : (totalOrder * foundDiscount.discount_value) / 100
    return { totalOrder, discount: amount, totalPrice: totalOrder - amount }
  }

  // Delete Discount : ShopId, codeId
  static async deleteDiscountCode({ code, shopId }: { code: string; shopId: string }) {
    const deletedDiscount = await discountModel.findOneAndDelete({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    })
    return deletedDiscount
  }

  //Cancel Discount : CodeId, userId,shopid   $pull #inc
  static async cancelDiscountCode({ code, userId, shopId }: { code: string; userId: string; shopId: string }) {
    const foundDiscount = await checkDiscountExists({
      filter: { discount_code: code, discount_shopId: convertToObjectId(shopId) }
    })
    if (!foundDiscount) {
      throw createHttpError(404, 'Discount code not found')
    }

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: { discount_users_used: { userId } },
      $inc: {
        discount_max_usage: 1,
        discount_usage_count: -1
      }
    })
    return result
  }
}

export default DiscountService
