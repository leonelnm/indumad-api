import rateLimit from 'express-rate-limit'
import config from '../config/config.js'

const { loginRateLimite } = config.rateLimiter

const loginLimiter = rateLimit({
  windowMs: loginRateLimite.lockMinutes * 60 * 1000,
  max: loginRateLimite.attempts,
  message: {
    error: `Demasiados intentos de inicio de sesión, por favor intentar luego de ${loginRateLimite.lockMinutes} minutos`
  },
  skipSuccessfulRequests: true
})

export default loginLimiter
