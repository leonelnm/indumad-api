import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import Joi from 'joi'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '../../.env') })

const envVarsSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_TOKEN_EXPIRATION_MINUTES: Joi.number().default(30).description('Tiempo token válido'),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432), // default puerto postgresql
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_LOGGING: Joi.boolean().default(false),
  POSTGRES_DIALECT: Joi.string().default('postgres'),
  SALT_ROUNDS: Joi.number().default(10)
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
  saltRound: envVars.SALT_ROUNDS
}
