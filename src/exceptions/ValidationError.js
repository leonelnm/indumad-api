export class ValidationError extends Error {
  constructor (code = 400, message) {
    super(message)
    this.name = 'ValidationError'
    this.code = code
  }
}
