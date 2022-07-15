import rateLimit from 'express-rate-limit'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many accounts created from this IP, please try again after 15 minutes',
  skipSuccessfulRequests: true
})

export default authLimiter
