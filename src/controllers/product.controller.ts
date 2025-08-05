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
}

const productController = new ProductController()

export default productController
