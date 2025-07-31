import express from 'express'
import accessController from '~/controllers/access.controller'
import asyncHandler from 'express-async-handler'

const router = express.Router()

// Signup route
router.post('/shop/signup', asyncHandler(accessController.signup))

export default router
