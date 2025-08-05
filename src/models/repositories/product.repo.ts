import { productModel } from '../product.model'

const queryProducts = async (query: any, limit: number, skip: number) => {
  return await productModel
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec()
}
const findAllDraftsForShop = async ({ query, limit, skip }: { query: any; limit: number; skip: number }) => {
  try {
    const products = await queryProducts(query, limit, skip)
    return products
  } catch (error) {
    throw new Error('Failed to fetch draft products')
  }
}

const findAllPublishedProductsByShop = async ({ query, limit, skip }: { query: any; limit: number; skip: number }) => {
  try {
    const products = await queryProducts(query, limit, skip)
    return products
  } catch (error) {
    throw new Error('Failed to fetch published products')
  }
}

const publishedProductByShop = async ({ product_shop, product_id }: { product_shop: string; product_id: string }) => {
  try {
    // const product = await productModel.findOne({ product_shop, _id: product_id }).exec()
    // if (!product) {
    //   throw new Error('Product not found')
    // }
    // product.isDraft = false
    // product.isPublished = true
    // const {} = await product.updateOne({ isDraft: false, isPublished: true })
    // await product.save()
    // return product
    const product = await productModel.findOneAndUpdate(
      { product_shop, _id: product_id },
      { isDraft: false, isPublished: true }
    )
    return product
  } catch {
    throw new Error('Failed to publish product')
  }
}

const searchProductsByUser = async ({ searchTerm }: { searchTerm: string }) => {
  const results = await productModel
    .find(
      {
        isDraft: false,
        $text: { $search: searchTerm }
      },
      {
        score: { $meta: 'textScore' }
      }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean()

  return results
}

export { findAllDraftsForShop, publishedProductByShop, findAllPublishedProductsByShop, searchProductsByUser }
