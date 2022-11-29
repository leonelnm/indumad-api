export const JobStateType = {
  INITIAL: 'Pte. ASIGNAR',
  PENDING_VISITED: 'Pte. CITA Prof.',
  PENDING_BUDGET: 'Esperando Presupuesto',
  BUDGET_VALIDATE: 'Pte. Aprobación Presupuesto',
  BUDGET_AUTHORIZED: 'En curso',
  DONE: 'Terminado',
  BILLING: 'Facturado',
  PREFINISH: 'Pte. COBRO',
  FINISH: 'Cobrado',
  CANCELED: 'Anulado'
}

export const JobStateTypeAsList = Object.values(JobStateType)
