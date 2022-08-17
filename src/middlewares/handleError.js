const controlledExceptions = [
  'SequelizeValidationError',
  'SequelizeUniqueConstraintError',
  'ValidationError'
]

export default (error, _req, res, _next) => {
  console.log('Name', error.name)
  console.log('Message', error.message)

  if ((error instanceof Error) &&
    controlledExceptions.includes(error.name)) {
    const code = error.code || 400

    res.status(code).send({
      error: error.message
    })
  } else {
    console.log('StackTrace', error)
    res.status(500).send({ error: 'Error inesperado, contacte con el Administrador' })
  }
}
