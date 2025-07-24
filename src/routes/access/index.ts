import express, { Request, Response } from 'express'
import accessController from '~/controllers/access.controller'

const router = express.Router()

// Signup route
router.post('/shop/signup', accessController.signup)

export default router
