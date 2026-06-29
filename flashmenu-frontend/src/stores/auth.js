import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LocalStorage } from 'quasar'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(LocalStorage.getItem('token') || null)
  const restaurant = ref(LocalStorage.getItem('restaurant') || null)

  const isAuthenticated = computed(() => Boolean(token.value))
  const restaurantName = computed(() => restaurant.value?.name || '')
  const restaurantSlug = computed(() => restaurant.value?.slug || '')

  function setSession({ token: newToken, restaurant: newRestaurant }) {
    token.value = newToken
    restaurant.value = newRestaurant || null
    LocalStorage.setItem('token', newToken)
    if (newRestaurant) {
      LocalStorage.setItem('restaurant', newRestaurant)
    }
  }

  function setToken(value) {
    token.value = value
    if (value) {
      LocalStorage.setItem('token', value)
    } else {
      LocalStorage.remove('token')
    }
  }

  function logout() {
    token.value = null
    restaurant.value = null
    LocalStorage.remove('token')
    LocalStorage.remove('restaurant')
  }

  return {
    token,
    restaurant,
    isAuthenticated,
    restaurantName,
    restaurantSlug,
    setSession,
    setToken,
    logout,
  }
})
