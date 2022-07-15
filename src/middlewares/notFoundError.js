export default (req, res, _next) => {
console.log(`Intentado acceder a ${req.path}`)

  res.status(404).send({ msg: 'Not found!' }).end()
}
