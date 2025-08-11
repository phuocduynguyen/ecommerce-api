import { convertToObjectId } from '~/utils'
import cartModel from '../cart.model'

const findCartById = async (cartId: string) => {
  const cart = await cartModel.findOne({ _id: convertToObjectId(cartId), cart_state: 'active' }).lean()
  return cart
}

export { findCartById }
