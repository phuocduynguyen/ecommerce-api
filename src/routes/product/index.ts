import express from 'express'
import asyncHandler from 'express-async-handler'
import { authentication } from '~/auth/authUtils'
import productController from '~/controllers/product.controller'

const router = express.Router()

router.use(authentication)
router.post('/create', asyncHandler(productController.createProduct))
router.get('/drafts/all', asyncHandler(productController.getALlDraftsForShop))

export default router
