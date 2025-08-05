import express from 'express'
import asyncHandler from 'express-async-handler'
import { authentication } from '~/auth/authUtils'
import productController from '~/controllers/product.controller'

const router = express.Router()

router.get('/search/:searchTerm', asyncHandler(productController.getProductsBySearch))
router.get('/all', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProductById))
router.use(authentication)
router.post('/create', asyncHandler(productController.createProduct))
router.get('/drafts/all', asyncHandler(productController.getALlDraftsForShop))
router.put('/published/:product_id', asyncHandler(productController.publishedProductByShop))
router.get('/published/all', asyncHandler(productController.getAllPublishedProductsByShop))

export default router
