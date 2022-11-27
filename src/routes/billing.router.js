import { Router } from 'express'
import { createInvoiceOnDemand, findAllBillingByYear } from '../controllers/job.controller.js'
import validateToken from '../middlewares/validateToken.js'
import { isGestor, isGestorOrAutonomo } from '../middlewares/validateRole.js'

const billingRouter = Router()

billingRouter.get('/', validateToken, isGestorOrAutonomo, findAllBillingByYear)
billingRouter.post('/ondemand', validateToken, isGestor, createInvoiceOnDemand)

export default billingRouter
