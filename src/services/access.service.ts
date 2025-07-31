import shopModel from '~/models/shop.model'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import KeyTokenService from './keyToken.service'
import mongoose from 'mongoose'
import createTokenPair from '~/auth/authUtils'
import { getInfoData } from '~/utils'
import createError from 'http-errors'
interface SignupInput {
  email: string
  password: string
  name: string
}

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR'
}
class AccessService {
  // Add your service methods here
  static async signup(input: SignupInput) {
    const { email, password, name } = input
    // step 1: Check email exists
    const shopHolder = await shopModel.findOne({ email }).lean()
    if (shopHolder) {
      // return {
      //   code: 400,
      //   message: 'Email already exists'
      // }
      throw createError(400, 'Email already exists')
    }

    // step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    if (!hashedPassword) {
      // return {
      //   code: 500,
      //   message: 'Failed to hash password'
      // }
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
      console.log('Private Key:', privateKey)
      console.log('Public Key:', publicKey)

      // Create key token
      const publicKeyToken = await KeyTokenService.createKeyToken({
        userId: newShop._id as mongoose.Types.ObjectId,
        publicKey
      })
      if (!publicKeyToken) {
        // return {
        //   code: 500,
        //   message: 'Failed to create key token'
        // }
        throw createError(500, 'Failed to create key token')
      }
      console.log('Public Key Token:', publicKeyToken)
      const publicKeyTokenObject = crypto.createPublicKey(publicKeyToken as string)
      console.log('Public Key Token Object:', publicKeyTokenObject)
      // create token pair
      const { accessToken, refreshToken } = await createTokenPair({
        payload: { userId: newShop._id, email: newShop.email, roles: newShop.roles },
        privateKey,
        publicKey: publicKeyTokenObject
      })
      console.log('Access Token:', accessToken)
      console.log('Refresh Token:', refreshToken)
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
