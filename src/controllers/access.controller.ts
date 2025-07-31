import { Request, Response, NextFunction } from 'express'
import AccessService from '~/services/access.service'
class AccessController {
  logout = async (req: any, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await AccessService.logout(req.keyStore))
    } catch (error) {
      res.status(500).json({ error: 'An error occurred during logout' })
      next(error)
    }
  }

  signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await AccessService.login(req.body))
    } catch (error) {
      res.status(500).json({ error: 'An error occurred during signin' })
      next(error)
    }
  }

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
