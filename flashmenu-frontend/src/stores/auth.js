import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LocalStorage } from 'quasar'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(LocalStorage.getItem('token') || null)

  const isAuthenticated = computed(() => Boolean(token.value))

  function setToken(value) {
    token.value = value
    if (value) {
      LocalStorage.setItem('token', value)
    } else {
      LocalStorage.remove('token')
    }
  }

  function logout() {
    setToken(null)
  }

  return {
    token,
    isAuthenticated,
    setToken,
    logout,
  }
})
