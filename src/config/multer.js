import multer from 'multer'
import config from './config.js'
import { ValidationError } from '../exceptions/ValidationError.js'

// const storage = multer.memoryStorage()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const mimetypes = [
  'image/jpeg',
  'image/png'
]

const fileFilter = (req, file, cb) => {
  try {
    if (mimetypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new ValidationError(400, 'Unsupported file format'))
    }
  } catch (error) {
    cb(new Error('Unexpected error on Multer.fileFileter!'))
  }
}

const limitSize = config.evidenceSize * 1024 * 1024

export const upload = multer({
  storage,
  limits: {
    fieldSize: limitSize,
    fileSize: limitSize,
    files: 1,
    fields: 1
  },
  fileFilter
})
