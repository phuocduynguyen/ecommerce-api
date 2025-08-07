import express from 'express'
import asyncHandler from 'express-async-handler'
import { authentication } from '~/auth/authUtils'
import discountController from '~/controllers/discount.controller'

const router = express.Router()

router.post('/amonnt', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct))
router.use(authentication)

router.post('/create', asyncHandler(discountController.createDiscountCode))
router.get('/all', asyncHandler(discountController.getAllDiscountCodesByShop))

export default router
