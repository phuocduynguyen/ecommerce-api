import express from 'express'
import accessController from '~/controllers/access.controller'
import asyncHandler from 'express-async-handler'
import { authentication } from '~/auth/authUtils'

const router = express.Router()

// Signup route
router.post('/shop/signup', asyncHandler(accessController.signup))

// Signin route
router.post('/shop/signin', asyncHandler(accessController.signin))

router.use(authentication)

// Logout route
router.post('/shop/logout', asyncHandler(accessController.logout))

export default router
