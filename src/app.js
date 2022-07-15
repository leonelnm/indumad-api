import express from 'express'
import morgan from 'morgan'
import config from './config/config.js'
import handleError from './middlewares/handleError.js'
import notFoundError from './middlewares/notFoundError.js'
import authLimiter from './middlewares/rateLimiter.js'
import router from './routes/index.js'

const app = express()

app.use(morgan('tiny'))

app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// limit repeated failed requests to auth endpoints
if (config.env === 'development') {
  app.use('/api/v1/auth', authLimiter)
}

// v1 api routes
app.use('/api/v1', router)

// send back a 404 error for any unknown api request
app.use(notFoundError)

// handle error
app.use(handleError)

export default app
