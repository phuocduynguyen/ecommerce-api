import { ObjectId } from 'mongodb'
import keyTokenModel from '~/models/keytoken.model'

interface CreateKeyTokenParams {
  userId: ObjectId
  privateKey: string
  publicKey: string
  refreshToken?: string
}
class KeyTokenService {
  static async createKeyToken(params: CreateKeyTokenParams) {
    const { userId, publicKey, privateKey, refreshToken } = params
    try {
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey
      // })
      // return tokens ? tokens.publicKey : null

      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken
        },
        options = { upsert: true, new: true }
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options).lean()
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static async findByUserId(userId: ObjectId) {
    try {
      const keyToken = await keyTokenModel.findOne({ user: userId }).lean()
      return keyToken ? keyToken : null
    } catch (error) {
      return error
    }
  }

  static async removeKeyById(userId: ObjectId) {
    try {
      const result = await keyTokenModel.deleteOne({ user: userId })
      return result.deletedCount > 0
    } catch (error) {
      return error
    }
  }
}
export default KeyTokenService
