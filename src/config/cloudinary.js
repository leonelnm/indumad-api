import config from './config.js'
import cloudinaryModule from 'cloudinary'

export const cloudinary = cloudinaryModule.v2

const cloudinaryConfig = {
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
}

cloudinary.config(cloudinaryConfig)
