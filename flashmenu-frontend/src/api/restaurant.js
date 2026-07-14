import { api } from 'src/boot/axios'

export const getMyRestaurant = () => api.get('/api/v1/restaurants/me')
export const updateMyRestaurant = (data) => api.put('/api/v1/restaurants/me', data)
export const updateMyPassword = (data) => api.put('/api/v1/restaurants/me/password', data)
export const completeOnboarding = () => api.post('/api/v1/restaurants/me/complete-onboarding')
