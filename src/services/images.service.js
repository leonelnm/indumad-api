import { cloudinary } from '../config/cloudinary.js'

export const uploadImage = async ({ path }, jobId) => {
  const options = {
    folder: `job/${jobId}`,
    tags: `job-${jobId}`
  }

  const { secure_url: url, public_id: name } = await cloudinary.uploader.upload(path, options)

  return {
    url,
    name
  }
}

export const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}
