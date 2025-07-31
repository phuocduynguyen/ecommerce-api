import apiKeyModel from '~/models/apikey.model'
import crypto from 'crypto'

const findById = async (key: string) => {
  // const testkey = await apiKeyModel.create({
  //   key: crypto.randomBytes(64).toString('hex'),
  //   status: true,
  //   permissions: ['0000']
  // })
  // console.log('Test API Key created:', testkey.key)
  const apiKey = await apiKeyModel.findOne({ key, status: true }).lean()
  return apiKey
}
export default findById
