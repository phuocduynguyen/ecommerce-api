import mongoose from 'mongoose'
import { countConnections } from '~/helpers/check.connect'

const connectionString = 'mongodb+srv://phuocnt150799:ZSZ57Da1I0sYtF8h@ecommerce-api.ysbsnuk.mongodb.net/Ecommerce-API'
class Database {
  private static instance: Database
  constructor() {
    this.connect()
  }

  //connect to MongoDB
  connect() {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })

    mongoose
      .connect(connectionString, {
        maxPoolSize: 10 // Set the maximum pool size
      })
      .then(() => {
        countConnections()
        console.log('MongoDB connected successfully')
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error)
      })
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
export default instanceMongodb
