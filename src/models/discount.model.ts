import mongoose from 'mongoose'

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'
const discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true
    },
    discount_description: {
      type: String,
      required: true
    },
    discount_type: {
      type: String,
      default: 'fixed_amount'
    },
    discount_value: {
      type: Number,
      required: true
    },
    discount_start_date: {
      type: Date,
      required: true
    },
    discount_end_date: {
      type: Date,
      required: true
    },
    discount_code: {
      type: String,
      required: true
    },
    discount_max_usage: {
      type: Number,
      required: true
    },
    discount_usage_count: {
      type: Number,
      default: 0
    },
    discount_users_used: {
      type: Array,
      default: []
    },
    discount_max_usage_per_user: {
      type: Number,
      required: true
    },
    discount_min_order_value: {
      type: Number,
      required: true
    },
    discount_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    discount_is_active: {
      type: Boolean,
      default: true
    },
    discount_applies_to: {
      type: String,
      enum: ['all', 'specific'],
      default: ['all']
    },
    discount_product_ids: {
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
const discountModel = mongoose.model(DOCUMENT_NAME, discountSchema)
export default discountModel
