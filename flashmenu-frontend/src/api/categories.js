import { api } from 'src/boot/axios'

export const listCategories = () => api.get('/api/v1/restaurants/me/categories')

export const createCategory = (data) => api.post('/api/v1/restaurants/me/categories', data)

export const updateCategory = (id, data) => api.put(`/api/v1/restaurants/me/categories/${id}`, data)

export const deleteCategory = (id) => api.delete(`/api/v1/restaurants/me/categories/${id}`)

export const reorderCategories = (list) =>
  api.put('/api/v1/restaurants/me/categories/reorder', { categories: list })
