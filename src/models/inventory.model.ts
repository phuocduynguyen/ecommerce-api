import mongoose, { Schema } from 'mongoose'

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'
const inventorySchema = new mongoose.Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    inven_location: {
      type: String,
      default: 'unknown'
    },
    inven_stock: {
      type: Number,
      default: 0
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    inven_reservations: {
      type: Array,
      default: []
    }
    /*
    cardId: 1,
    stock: 1,
    createdAt: ...
     */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model
const inventoryModel = mongoose.model(DOCUMENT_NAME, inventorySchema)
export default inventoryModel
