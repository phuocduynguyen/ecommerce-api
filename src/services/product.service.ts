import { productModel, clothingModel, electronicModel } from '../models/product.model'
import createHttpError from 'http-errors'

interface ProductInput {
  product_name: string
  product_thumb: string
  product_description: string
  product_price: number
  product_quantity: number
  product_type: string
  product_shop: string
  product_attributes: object
}
// Define Factory class to create product

class ProductFactory {
  static createProduct({ type, payload }: { type: string; payload: ProductInput }) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).createProduct()
      case 'Electronics':
        return new Electronics(payload).createProduct()
      default:
        throw createHttpError(400, `Invalid product type: ${type}`)
    }
  }
}

// Define base product class

class Product {
  product_name: string
  product_thumb: string
  product_description: string
  product_price: number
  product_quantity: number
  product_type: string
  product_shop: string
  product_attributes: object
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }: ProductInput) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  // Add common product methods here
  async createProduct(product_id?: any) {
    return await productModel.create({ ...this, _id: product_id })
  }
}

// Define specific product classes for Clothing and Electronics

class Clothing extends Product {
  // Add specific methods for Clothing if needed

  async createProduct() {
    const newClothing = await clothingModel.create(this.product_attributes)
    if (!newClothing) {
      throw createHttpError(400, 'Failed to create clothing product')
    }
    const newProduct = await super.createProduct()
    if (!newProduct) {
      throw createHttpError(400, 'Failed to create product')
    }
    return newProduct
  }
}

class Electronics extends Product {
  // Add specific methods for Clothing if needed

  async createProduct() {
    const newElectronic = await electronicModel.create({ ...this.product_attributes, product_shop: this.product_shop })
    if (!newElectronic) {
      throw createHttpError(400, 'Failed to create electronic product')
    }
    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) {
      throw createHttpError(400, 'Failed to create product')
    }
    return newProduct
  }
}

export { ProductFactory }
