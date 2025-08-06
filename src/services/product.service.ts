import {
  findAllDraftsForShop,
  findAllProducts,
  findAllPublishedProductsByShop,
  findProductById,
  publishedProductByShop,
  searchProductsByUser
} from '~/models/repositories/product.repo'
import { productModel, clothingModel, electronicModel } from '../models/product.model'
import createHttpError from 'http-errors'
import { Types } from 'mongoose'
import { insertInventory } from '~/models/repositories/inventory.repo'

interface ProductInput {
  product_name: string
  product_thumb: string
  product_description: string
  product_price: number
  product_quantity: number
  product_type: string
  product_shop: string
  product_attributes: object
  product_slug?: string
  product_ratingAverage?: number
  product_variations?: object[]
  isDraft?: boolean
  isPublished?: boolean
}
// Define Factory class to create product

class ProductFactory {
  static async createProduct({ type, payload }: { type: string; payload: ProductInput }) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).createProduct()
      case 'Electronics':
        return new Electronics(payload).createProduct()
      default:
        throw createHttpError(400, `Invalid product type: ${type}`)
    }
  }

  static async updateProduct({
    type,
    product_id,
    payload
  }: {
    type: string
    product_id: string
    payload: ProductInput
  }) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload).updateProduct(new Types.ObjectId(product_id))
      case 'Electronics':
        return new Electronics(payload).updateProduct(new Types.ObjectId(product_id))
      default:
        throw createHttpError(400, `Invalid product type: ${type}`)
    }
  }

  static async findAllDraftsForShop({
    product_shop,
    limit = 50,
    skip = 0
  }: {
    product_shop: string
    limit: number
    skip: number
  }) {
    const query = {
      product_shop,
      isDraft: true
    }
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static async publishedProductByShop({ product_shop, product_id }: { product_shop: string; product_id: string }) {
    return await publishedProductByShop({ product_shop, product_id })
  }

  static async findAllPublishedProductsByShop({
    product_shop,
    limit = 50,
    skip = 0
  }: {
    product_shop: string
    limit: number
    skip: number
  }) {
    const query = {
      product_shop,
      isPublished: true
    }
    return await findAllPublishedProductsByShop({ query, limit, skip })
  }

  static async searchProducts({ searchTerm }: { searchTerm: string }) {
    return await searchProductsByUser({ searchTerm })
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true }
  }: {
    limit?: number
    sort?: string
    page?: number
    filter?: any
  }) {
    // const skip = (page - 1) * limit
    // const query = { ...filter }
    // return await productModel.find(query).sort({ [sort]: -1 }).limit(limit).skip(skip).exec()
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_quantity', 'product_type']
    })
  }

  static async findProductById({ product_id }: { product_id: string }) {
    return await findProductById({ product_id, unSelect: ['__v'] })
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
  product_slug?: string
  product_ratingAverage?: number
  product_variations?: object[]
  isDraft?: boolean
  isPublished?: boolean
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
    product_slug,
    product_ratingAverage,
    product_variations,
    isDraft,
    isPublished
  }: ProductInput) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_slug = product_slug
    this.product_ratingAverage = product_ratingAverage
    this.product_variations = product_variations
    this.isDraft = isDraft
    this.isPublished = isPublished
  }

  // Add common product methods here
  async createProduct(product_id: Types.ObjectId) {
    const newProduct = await productModel.create({ ...this, _id: product_id })
    if (newProduct) {
      // add product_stock in inventory collection
      await insertInventory({
        payload: {
          inven_productId: newProduct._id,
          inven_stock: newProduct.product_quantity,
          inven_shopId: newProduct.product_shop
        }
      })
    }
    return newProduct
  }

  async updateProduct(product_id: Types.ObjectId, payload: ProductInput) {
    const updatedProduct = await productModel.findByIdAndUpdate(product_id, payload, { new: true, runValidators: true })
    if (!updatedProduct) {
      throw createHttpError(404, 'Product not found')
    }
    return updatedProduct
  }
}

// Define specific product classes for Clothing and Electronics

class Clothing extends Product {
  // Add specific methods for Clothing if needed

  async createProduct() {
    const newClothing = await clothingModel.create({ ...this.product_attributes, product_shop: this.product_shop })
    if (!newClothing) {
      throw createHttpError(400, 'Failed to create clothing product')
    }
    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) {
      throw createHttpError(400, 'Failed to create product')
    }
    return newProduct
  }

  async updateProduct(productId: Types.ObjectId) {
    const productAttributes = this.product_attributes

    //TODO: Check if productAttributes is valid (undefined,null,etc)
    const updatedProduct = await super.updateProduct(productId, {
      ...this,
      product_attributes: productAttributes
    })

    return updatedProduct
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

  async updateProduct(productId: Types.ObjectId) {
    const productAttributes = this.product_attributes

    //TODO: Check if productAttributes is valid (undefined,null,etc)
    const updatedProduct = await super.updateProduct(productId, {
      ...this,
      product_attributes: productAttributes
    })

    return updatedProduct
  }
}

export { ProductFactory }
