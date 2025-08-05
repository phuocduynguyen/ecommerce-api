import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { ProductFactory } from '~/services/product.service'

class ProductController {
  // Other methods...

  async createProduct(req: any, res: Response, next: NextFunction) {
    try {
      const product = await ProductFactory.createProduct({
        type: req.body.product_type,
        payload: {
          ...req.body,
          product_shop: req.user.userId
        }
      })
      res.status(201).json({
        message: 'Product created successfully',
        product
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }

  // Other methods...
  // PUT
  async publishedProductByShop(req: any, res: Response, next: NextFunction) {
    try {
      const product = await ProductFactory.publishedProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id
      })
      if (!product) {
        return next(createHttpError(404, 'Product not found'))
      }
      res.status(200).json({
        message: 'Product published successfully',
        product
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }
  // QUERY
  async getALlDraftsForShop(req: any, res: Response, next: NextFunction) {
    try {
      const allDrafts = await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
        limit: 50,
        skip: 0
      })
      res.status(200).json({
        message: 'Draft products fetched successfully',
        data: allDrafts
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }

  async getAllPublishedProductsByShop(req: any, res: Response, next: NextFunction) {
    try {
      const allPublishedProducts = await ProductFactory.findAllPublishedProductsByShop({
        product_shop: req.user.userId,
        limit: 50,
        skip: 0
      })
      res.status(200).json({
        message: 'Published products fetched successfully',
        data: allPublishedProducts
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }

  async getProductsBySearch(req: any, res: Response, next: NextFunction) {
    try {
      const { searchTerm } = req.params
      const products = await ProductFactory.searchProducts({ searchTerm })
      res.status(200).json({
        message: 'Products fetched successfully',
        data: products
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }
}

const productController = new ProductController()

export default productController
