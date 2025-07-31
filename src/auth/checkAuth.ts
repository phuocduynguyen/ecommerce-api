'use strict'
import { Response, NextFunction } from 'express'
import findById from '~/services/apikey.service'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}
const apiKey = async (req: any, res: Response, next: NextFunction) => {
  const apiKey = req.headers[HEADER.API_KEY]

  if (!apiKey) {
    return res.status(403).json({ message: 'API key is required' })
  }

  // check objkey
  const objKey = await findById(apiKey as string)
  if (!objKey) {
    return res.status(403).json({ message: 'Invalid API key' })
  }
  req.objKey = objKey

  next()
}

const permission = (permission: string) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: 'permission denied' })
    }
    const permissions = req.objKey.permissions
    console.log('permissions', permissions)
    if (!permissions.includes(permission)) {
      return res.status(403).json({ message: 'Permission denied' })
    }
    next()
  }
}

export { apiKey, permission }
