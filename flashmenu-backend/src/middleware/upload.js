import multer from 'multer'
import { BadRequestError } from '../core/errors/http-errors.js'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new BadRequestError('Formato de imagem não suportado. Use JPEG, PNG ou WebP'))
  }
  cb(null, true)
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter,
})
