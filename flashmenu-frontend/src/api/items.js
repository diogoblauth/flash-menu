import { api } from 'src/boot/axios'

export const listItems = () => api.get('/api/v1/restaurants/me/items')

export const createItem = (data) => api.post('/api/v1/restaurants/me/items', data)

export const updateItem = (id, data) => api.put(`/api/v1/restaurants/me/items/${id}`, data)

export const deleteItem = (id) => api.delete(`/api/v1/restaurants/me/items/${id}`)

export const toggleItemActive = (id, active) =>
  api.patch(`/api/v1/restaurants/me/items/${id}/active`, { active })

export const reorderItems = (list) => api.put('/api/v1/restaurants/me/items/reorder', { items: list })
