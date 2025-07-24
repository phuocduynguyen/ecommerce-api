import jwt from 'jsonwebtoken'
import crypto from 'crypto'
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

export default createTokenPair
