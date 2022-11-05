const controlledExceptions = [
  'SequelizeValidationError',
  'SequelizeUniqueConstraintError',
  'ValidationError',
  'MulterError'
]

const evaluateCode = (data) => {
  let code = 400
  let codeString = null
  if (isNaN(data)) {
    codeString = data
  } else {
    code = data * 1
  }

  return { code, codeString }
}

export default (error, _req, res, _next) => {
  console.log('Name', error.name)
  console.log('Message', error.message)

  if ((error instanceof Error) &&
    controlledExceptions.includes(error.name)) {
    const { code, codeString } = evaluateCode(error.code)

    res.status(code).send({
      ...(codeString && { code: codeString }),
      msg: error.message
    })
  } else {
    console.log('StackTrace', error)
    res.status(500).send({ error: 'Error inesperado, contacte con el Administrador' })
  }
}
