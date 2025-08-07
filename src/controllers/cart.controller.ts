import { Request, Response, NextFunction } from 'express'
import createHttpError from 'http-errors'
import { add } from 'lodash'
import CartService from '~/services/cart.service'
class CartController {
  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.addToCart(req.body)
      res.status(201).json({
        message: 'Product added to cart successfully',
        cart
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }

  async getLisUserCart(req: any, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.getLisUserCart(req.query)
      res.status(200).json({
        message: 'Cart fetched successfully',
        cart
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }

  async deleteUserCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.deleteUserCart(req.body)
      res.status(200).json({
        message: 'Cart deleted successfully',
        cart
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }

  async updateUserCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.addToCartV2(req.body)
      res.status(200).json({
        message: 'Cart updated successfully',
        cart
      })
    } catch (error) {
      if (error instanceof createHttpError.HttpError) {
        return next(error)
      }
      return next(createHttpError(500, 'Internal Server Error'))
    }
  }
}

const cartController = new CartController()

export default cartController
