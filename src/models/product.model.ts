import mongoose, { Schema } from 'mongoose'

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true
    },
    product_thumb: {
      type: String,
      required: true
    },
    product_description: {
      type: String
    },
    product_price: {
      type: Number,
      required: true
    },
    product_quantity: {
      type: Number,
      required: true
    },

    // product type can be Electronics, Clothing, Furniture, etc.
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)

const clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true
    },
    size: {
      type: String
    },
    material: {
      type: String
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    timestamps: true,
    collection: 'clothes'
  }
)

const electronicSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: true
    },
    model: {
      type: String
    },
    color: {
      type: String
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop'
    }
  },
  {
    timestamps: true,
    collection: 'electronics'
  }
)

//Export the model
const productModel = mongoose.model(DOCUMENT_NAME, productSchema)
const clothingModel = mongoose.model('Clothing', clothingSchema)
const electronicModel = mongoose.model('Electronics', electronicSchema)
export { productModel, clothingModel, electronicModel }
