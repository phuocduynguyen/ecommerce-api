import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { NextFunction, Response } from 'express'
import asyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import KeyTokenService from '~/services/keyToken.service'
import { ObjectId } from 'mongodb'

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
  REFRESH_TOKEN: 'refresh-token'
}

interface CreateTokenPairParams {
  payload: object
  privateKey: string
  publicKey: string | crypto.KeyObject
}
const createTokenPair = async ({ payload, privateKey, publicKey }: CreateTokenPairParams) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2d'
    })
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7d'
    })

    // test decode
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error('Access Token verification failed:', err)
      } else {
        console.log('Access Token decoded:', decode)
      }
    })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new Error('Failed to create token pair')
  }
}

const authenticationV2 = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  //step 1: check userId missing
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) {
    throw createHttpError(401, 'Invalid request')
  }
  //step 2: get accessToken
  const keyStore: any = await KeyTokenService.findByUserId(userId as ObjectId)
  if (!keyStore) {
    throw createHttpError(404, 'Key store not found')
  }

  //Check refresh token
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
    if (!refreshToken) {
      throw createHttpError(401, 'Invalid request')
    }
    try {
      const decodedRefresh = jwt.verify(refreshToken, keyStore.privateKey)
      if (typeof decodedRefresh === 'object' && 'userId' in decodedRefresh) {
        if (decodedRefresh.userId !== userId) {
          throw createHttpError(401, 'Invalid user ID')
        }
      } else {
        throw createHttpError(401, 'Invalid token payload')
      }
      req.keyStore = keyStore
      req.user = decodedRefresh
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      throw error instanceof jwt.JsonWebTokenError
    }
  }
  //step 3: verify accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) {
    throw createHttpError(401, 'Invalid request')
  }
  try {
    const decodedUser = jwt.verify(accessToken, keyStore.publicKey)
    if (typeof decodedUser === 'object' && 'userId' in decodedUser) {
      if (decodedUser.userId !== userId) {
        throw createHttpError(401, 'Invalid user ID')
      }
    } else {
      throw createHttpError(401, 'Invalid token payload')
    }
    req.keyStore = keyStore
    req.user = decodedUser
    return next()
  } catch (error) {
    throw error instanceof jwt.JsonWebTokenError
  }
  //step 4: check user in db
  //step 5: check keyStore with this userId
  //step 6: OK all => Return next()
})

const authentication = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  //step 1: check userId missing
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) {
    throw createHttpError(401, 'Invalid request')
  }
  //step 2: get accessToken
  const keyStore: any = await KeyTokenService.findByUserId(userId as ObjectId)
  if (!keyStore) {
    throw createHttpError(404, 'Key store not found')
  }
  //step 3: verify accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) {
    throw createHttpError(401, 'Invalid request')
  }
  try {
    const decodedUser = jwt.verify(accessToken, keyStore.publicKey)
    if (typeof decodedUser === 'object' && 'userId' in decodedUser) {
      if (decodedUser.userId !== userId) {
        throw createHttpError(401, 'Invalid user ID')
      }
    } else {
      throw createHttpError(401, 'Invalid token payload')
    }
    req.keyStore = keyStore
    req.user = decodedUser
    return next()
  } catch (error) {
    throw error instanceof jwt.JsonWebTokenError
  }
  //step 4: check user in db
  //step 5: check keyStore with this userId
  //step 6: OK all => Return next()
})

export { createTokenPair, authentication, authenticationV2 }
