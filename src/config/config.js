import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Joi from 'joi'
import { Environtment } from '../types/roleEnumType.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid(Environtment.PRODUCTION, Environtment.DEVELOPMENT, Environtment.TEST).required(),
  PORT: Joi.number().default(3000),

  // JWT
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_TOKEN_EXPIRATION_MINUTES: Joi.number().default(1).description('Tiempo token válido'),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432), // default puerto postgresql
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_LOGGING: Joi.boolean().default(false),
  POSTGRES_DIALECT: Joi.string().default('postgres'),

  // Bcrypt
  SALT_ROUNDS: Joi.number().default(10),

  // Rate limit
  RATE_LIMIT_LOGIN_ERROR_ATTEMPTS: Joi.number().default(20),
  RATE_LIMIT_LOGIN_TIME_LOCK_MINUTES: Joi.number().default(15)
}).unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error !== null && error !== undefined) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    tokenExpirationMinutes: envVars.JWT_TOKEN_EXPIRATION_MINUTES
  },
  dbConnection: {
    host: envVars.POSTGRES_HOST,
    port: envVars.POSTGRES_PORT,
    database: envVars.POSTGRES_DB,
    username: envVars.POSTGRES_USER,
    password: envVars.POSTGRES_PASSWORD,
    dialect: envVars.POSTGRES_DIALECT,
    logging: envVars.POSTGRES_LOGGING
  },
  rateLimiter: {
    loginRateLimite: {
      attempts: envVars.RATE_LIMIT_LOGIN_ERROR_ATTEMPTS,
      lockMinutes: envVars.RATE_LIMIT_LOGIN_TIME_LOCK_MINUTES
    }
  },
  saltRound: envVars.SALT_ROUNDS
}
