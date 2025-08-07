import express from 'express'
import asyncHandler from 'express-async-handler'
import cartController from '~/controllers/cart.controller'

const router = express.Router()

router.post('/update', asyncHandler(cartController.updateUserCart))
router.delete('', asyncHandler(cartController.deleteUserCart))

router.post('/create', asyncHandler(cartController.addToCart))
router.get('/all', asyncHandler(cartController.getLisUserCart))

export default router
