import { ObjectId } from 'mongodb'
import keyTokenModel from '~/models/keytoken.model'

interface CreateKeyTokenParams {
  userId: ObjectId
  publicKey: string
}
class KeyTokenService {
  static async createKeyToken(params: CreateKeyTokenParams) {
    const { userId, publicKey } = params
    try {
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey
      })
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }
}
export default KeyTokenService
