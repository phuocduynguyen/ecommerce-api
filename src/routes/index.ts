import express, { Request, Response, NextFunction } from 'express'
import accessRouter from './access'
import productRouter from './product'
import { apiKey, permission } from '../auth/checkAuth'
const router = express.Router()
// check api key
router.use((req: Request, res: Response, next: NextFunction) => {
  apiKey(req, res, next)
})
// check permissions
router.use(permission('0000'))

router.use('/v1/api/product', productRouter)
router.use('/v1/api', accessRouter)

export default router
