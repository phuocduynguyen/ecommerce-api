import apiKeyModel from '~/models/apikey.model'
import crypto from 'crypto'

const findById = async (key: string) => {
  try {
    const testkey = await apiKeyModel.create({
      key: crypto.randomBytes(64).toString('hex'),
      status: true,
      permissions: ['0000']
    })
    console.log('Test API Key created:', testkey.key)
    const apiKey = await apiKeyModel.findOne({ key, status: true }).lean()
    return apiKey
  } catch {
    throw new Error(`Error finding API key`)
  }
}
export default findById
