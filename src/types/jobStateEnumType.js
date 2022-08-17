export const JobStateType = {
  INITIAL: 'Pte. ASIGNAR',
  PENDING_SCHEDULED: 'Pte. AGENDAR CITA',
  ASIGNED: 'ASIGNADO',
  PENDING_VISITED: 'Pte. CITA Prof.',
  VISITED: 'VISITADO',
  BUDGET_VALIDATE: 'VALIDAR Ppto',
  BUDGET_AUTHORIZED: 'Ppto. AUTORIZADO',
  DONE: 'TERMINADO',
  PERITO: 'Pte PERITO',
  PREFINISH: 'Pte. COBRO',
  FINISH: 'COBRADO',
  CANCELED: 'ANULADO'
}

export const JobStateTypeAsList = Object.values(JobStateType)