import mongoose from 'mongoose'

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'
const cartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'failed', 'completed', 'pending'],
      default: 'active'
    },
    cart_products: {
      type: Array,
      required: true,
      default: []
    },
    /*
    [
      {
      productId,
      shopId,
      quantity,
      name,
      price
      }
    ]
     */
    cart_userId: {
      type: String,
      required: true
    },
    cart_count_products: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model
const cartModel = mongoose.model(DOCUMENT_NAME, cartSchema)
export default cartModel
