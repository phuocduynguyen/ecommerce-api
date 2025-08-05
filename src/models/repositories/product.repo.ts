import { productModel } from '../product.model'

const findAllDraftsForShop = async ({ query, limit, skip }: { query: any; limit: number; skip: number }) => {
  try {
    const products = await productModel
      .find(query)
      .populate('product_shop', 'name email -_id')
      .limit(limit)
      .skip(skip)
      .exec()
    return products
  } catch (error) {
    throw new Error('Failed to fetch draft products')
  }
}

export { findAllDraftsForShop }
