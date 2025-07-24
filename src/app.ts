import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import instanceMongodb from './dbs/init.mongodb'
import { checkOverloadedConnections } from './helpers/check.connect'
import router from './routes'
// import 'dotenv/config'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init db
instanceMongodb.connect()
checkOverloadedConnections()

// init routes

// app.get('/', (req, res, next) => {
//   return res.status(200).json({
//     message: 'Welcome to the E-commerce API'
//   })
// })

app.use(router)

// init error handling

export default app
