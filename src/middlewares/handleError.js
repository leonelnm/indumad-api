const controlledExceptions = [
  'SequelizeValidationError',
  'SequelizeUniqueConstraintError'
]

export default (error, _req, res, _next) => {
  console.log('Is error instance', error instanceof Error)
  console.log('Name', error.name)
  console.log('Message', error.name)

  if (error instanceof Error &&
    controlledExceptions.includes(error.name)) {
    res.status(400).send({
      error: error.message
    })
  } else {
    console.log('StackTrace', error.stack)
    res.status(500).send({ error: 'Error inesperado, contacte con el Administrador' })
  }
}
