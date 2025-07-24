import mongoose, { Schema } from 'mongoose'

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
const keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      unique: true
    },
    publicKey: {
      type: String,
      required: true,
      unique: true
    },
    refreshToken: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

//Export the model
const keyTokenModel = mongoose.model(DOCUMENT_NAME, keyTokenSchema)
export default keyTokenModel
