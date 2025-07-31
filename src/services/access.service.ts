import shopModel from '~/models/shop.model'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service'
import mongoose from 'mongoose'
import { getInfoData } from '~/utils'
import createError from 'http-errors'
import { findByEmail } from './shop.service'
import { createTokenPair } from '~/auth/authUtils'
interface SignupInput {
  email: string
  password: string
  name: string
}

interface SigninInput {
  email: string
  password: string
  refreshToken?: string
}

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR'
}
class AccessService {
  // Add your service methods here

  static async logout(keyStore: any) {
    const deleteKey = await KeyTokenService.removeKeyById(keyStore.user._id as mongoose.Types.ObjectId)
    if (!deleteKey) {
      throw createError(500, 'Failed to delete key token')
    }
    return deleteKey
  }
  static async login(input: SigninInput) {
    const { email, password } = input
    // step 1: Check email exists
    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw createError(400, 'Email not found')
    }
    // step 2: match password
    const isPasswordMatch = await bcrypt.compare(password, foundShop.password)
    if (!isPasswordMatch) {
      throw createError(400, 'Invalid password')
    }
    // step 3: create PrivateKey and PublicKey and save
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    })
    // step 4: generate tokens
    const tokens = await createTokenPair({
      payload: { userId: foundShop._id, email: foundShop.email, roles: foundShop.roles },
      privateKey,
      publicKey
    })

    await KeyTokenService.createKeyToken({
      userId: foundShop._id as mongoose.Types.ObjectId,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken
    })
    // step 5: get data return login
    return {
      code: 200,
      metadata: {
        shop: getInfoData({
          field: ['_id', 'name', 'email', 'roles'],
          object: foundShop
        }),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    }
  }
  static async signup(input: SignupInput) {
    const { email, password, name } = input
    // step 1: Check email exists
    const shopHolder = await shopModel.findOne({ email }).lean()
    if (shopHolder) {
      throw createError(400, 'Email already exists')
    }

    // step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    if (!hashedPassword) {
      throw createError(500, 'Failed to hash password')
    }
    // step 3: Create new shop
    const newShop = await shopModel.create({ email, password: hashedPassword, name, roles: [RoleShop.SHOP] })
    if (newShop) {
      // created privateKey, publicKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      })

      // Create key token
      const publicKeyToken = await KeyTokenService.createKeyToken({
        userId: newShop._id as mongoose.Types.ObjectId,
        privateKey: privateKey as string,
        publicKey
      })
      if (!publicKeyToken) {
        throw createError(500, 'Failed to create key token')
      }
      const publicKeyTokenObject = crypto.createPublicKey(publicKeyToken as string)

      // create token pair
      const { accessToken, refreshToken } = await createTokenPair({
        payload: { userId: newShop._id, email: newShop.email, roles: newShop.roles },
        privateKey,
        publicKey: publicKeyTokenObject
      })

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            field: ['_id', 'name', 'email', 'roles'],
            object: newShop
          }),
          accessToken,
          refreshToken
        }
      }
    }
  }

  // Other methods can be added as needed
}

export default AccessService
