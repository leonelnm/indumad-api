export const JobStateType = {
  INITIAL: 'Pte. ASIGNAR',
  PENDING_VISITED: 'Pte. CITA Prof.',
  PENDING_BUDGET: 'Esperando Presupuesto',
  BUDGET_VALIDATE: 'Pte. Aprobación Presupuesto',
  BUDGET_AUTHORIZED: 'En curso',
  DONE: 'TERMINADO',
  PREFINISH: 'Pte. COBRO',
  FINISH: 'COBRADO',
  CANCELED: 'ANULADO'
}

export const JobStateTypeAsList = Object.values(JobStateType)
