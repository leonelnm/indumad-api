import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import config from './config/config.js'
import handleError from './middlewares/handleError.js'
import notFoundError from './middlewares/notFoundError.js'
import loginLimiter from './middlewares/rateLimiter.js'
import router from './routes/index.js'
import { Environtment } from './types/roleEnumType.js'

const app = express()

app.use(morgan('dev'))

app.use(cors({
  credentials: true,
  origin: '*'
}))

app.disable('x-powered-by')
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// limit repeated failed requests to auth endpoints
if (config.env === Environtment.PRODUCTION) {
  app.use('/api/v1/auth/login', loginLimiter)
}

// v1 api routes
app.use('/api/v1', router)

// send back a 404 error for any unknown api request
app.use(notFoundError)

// handle error
app.use(handleError)

export default app
