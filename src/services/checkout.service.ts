import { findCartById } from '~/models/repositories/cart.repo'
import { checkProductByServer } from '~/models/repositories/product.repo'
import DiscountService from './discount.service'

class CheckoutService {
  /*
  {
  cartId,
  userId,
  shop_order_ids: [
      {
        shopid
        shop_discounts: [
          {
            shopId
            discountId,
            codeId
          }
        ],
        item_products: [
          {
            quantity,
            price,
            productId
          } 
        ]
      },
    ]
  }
   */
  static async checkoutReview({
    cartId,
    userId,
    shop_order_ids
  }: {
    cartId: string
    userId: string
    shop_order_ids: any
  }) {
    // check cardId exists?

    const foundCart = await findCartById(cartId)
    if (!foundCart) throw new Error('Cart not found')
    const checkout_order = {
      totalPrice: 0,
      feeShop: 0,
      totalDiscount: 0,
      totalCheckout: 0
    }
    const shop_order_ids_new = []
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, item_products, shop_discounts } = shop_order_ids[i]

      //check product available
      const checkProductServer = await checkProductByServer(item_products)
      const checkoutPrice = checkProductServer.reduce((total, item) => total + item.price * item.quantity, 0)

      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // price before discount
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      if (shop_discounts.length > 0) {
        // assume only 1 discount
        const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
          code: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })

        checkout_order.totalDiscount += discount
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }
    return { checkout_order, shop_order_ids, shop_order_ids_new }
  }
}

export default CheckoutService
