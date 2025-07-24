import { Request, Response, NextFunction } from 'express'
import AccessService from '~/services/access.service'
class AccessController {
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await AccessService.signup(req.body))
    } catch (error) {
      res.status(500).json({ error: 'An error occurred during signup' })
      next(error)
    }
  }
}

const accessController = new AccessController()

export default accessController
