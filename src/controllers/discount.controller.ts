import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'
import DiscountService from '~/services/discount.service'
class DiscountController {
  async createDiscountCode(req: Request, res: Response, next: NextFunction) {
    try {
      const discountCode = await DiscountService.createDiscountCode(req.body)
      res.status(201).json({
        message: 'Discount code created successfully',
        discountCode
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }

  async updateDiscountCode(req: Request, res: Response, next: NextFunction) {
    try {
      const discountCode = await DiscountService.updateDiscountCode({
        discount_id: req.params.discount_id,
        payload: req.body
      })
      res.status(200).json({
        message: 'Discount code updated successfully',
        discountCode
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }

  async getAllDiscountCodesWithProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const discountCodes = await DiscountService.getAllDiscountCodesWithProduct({
        shopId: req.params.shop_id,
        discountCode: req.params.discount_code,
        limit: +req.params.limit,
        page: +req.params.page
      })

      res.status(200).json({
        message: 'Discount codes fetched successfully',
        discountCodes
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }

  async getAllDiscountCodesByShop(req: any, res: Response, next: NextFunction) {
    try {
      const discountCodes = await DiscountService.getAllDiscountCodesByShop({
        shopId: req.user.userId,
        limit: +req.params.limit,
        page: +req.params.page
      })
      res.status(200).json({
        message: 'Discount codes fetched successfully',
        discountCodes
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }

  async getDiscountAmount(req: Request, res: Response, next: NextFunction) {
    try {
      const discountAmount = await DiscountService.getDiscountAmount({
        ...req.body
      })
      res.status(200).json({
        message: 'Discount amount fetched successfully',
        discountAmount
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }
}

const discountController = new DiscountController()

export default discountController
