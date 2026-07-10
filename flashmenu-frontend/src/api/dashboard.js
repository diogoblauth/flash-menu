import { api } from 'src/boot/axios'

export const getDashboard = () => api.get('/api/v1/restaurants/me/dashboard')
export const getQrCode = () => api.get('/api/v1/restaurants/me/qrcode', { responseType: 'blob' })
