import { api } from 'src/boot/axios'

export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/api/v1/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
