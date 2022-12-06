const REPLACE = '{%}'

export default {
  budget: {
    add: '<p><strong>Presupuesto:</strong></p>',
    total: `<p><br></p><p><strong>Total: </strong>${REPLACE}€</p>`,
    aproved: '<p><strong>Presupuesto APROBADO!</strong></p><p><br></p>',
    rejected: '<p><strong>Presupuesto rechazado!</strong></p><p><br></p>'
  },
  job: {
    complete: '<p><strong>Trabajo Finalizado!</strong></p>'
  }
}

export const getCustomMessage = (msg = '', text) => {
  return msg.replace(REPLACE, text)
}
