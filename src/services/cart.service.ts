/*
  - add product to card [user]
  - reduce product qty by one [user]
  - increase product qty by one [user]
  - get cart [user]
  - remove cart
  - remove cart item
*/

import cartModel from '~/models/cart.model'
import { getProductById } from '~/models/repositories/product.repo'

class CartService {
  static async createUserCart({ userId, product }: { userId: string; product: any }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      update = { $addToSet: { cart_products: product } },
      options = { upsert: true, new: true, setDefaultsOnInsert: true }
    return cartModel.findOneAndUpdate(query, update, options).lean()
  }

  static async updateUserCartQuantity({ userId, product }: { userId: string; product: any }) {
    const { productId, quantity } = product
    const query = { cart_userId: userId, 'cart_products.productId': productId, cart_state: 'active' },
      updateSet = { $inc: { 'cart_products.$.quantity': quantity } },
      options = { upsert: true, new: true }
    return cartModel.findOneAndUpdate(query, updateSet, options).lean()
  }

  static async addToCart({ userId, product = {} }: { userId: string; product: any }) {
    const userCart = await cartModel.findOne({ user: userId })
    if (!userCart) {
      return await CartService.createUserCart({ userId, product })
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    return await CartService.updateUserCartQuantity({ userId, product })
  }

  // update cart
  /*
    shop_order_ids: [
    { 
      userId,
      item_products: [
        {
          quantity,
          price,
          shopId,
          productId
          old_quantity
        }
      ],
      version
    }
    ]
   */
  static async addToCartV2({ userId, shop_order_ids }: { userId: string; shop_order_ids: any }) {
    const { productId, quantity, old_quantity, shopId } = shop_order_ids[0].item_products[0]
    const foundProduct = await getProductById({ product_id: productId })
    if (!foundProduct) {
      throw new Error('Product not found')
    }

    if (foundProduct.product_shop !== shopId) {
      throw new Error('Product not found')
    }
    return await CartService.updateUserCartQuantity({
      userId,
      product: { productId, quantity: quantity - old_quantity }
    })
  }

  static async deleteUserCart({ userId, productId }: { userId: string; productId: string }) {
    const query = {
        cart_userId: userId,
        cart_state: 'active'
      },
      update = { $pull: { cart_products: { productId } } }
    const deleteCart = await cartModel.updateOne(query, update)
    return deleteCart
  }

  static async getLisUserCart({ userId }: { userId: string }) {
    return await cartModel.find({ cart_userId: userId, cart_state: 'active' }).lean()
  }
}

export default CartService
