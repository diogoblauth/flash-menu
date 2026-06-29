<template>
  <q-card flat bordered class="login-card">
    <q-card-section class="text-center q-pb-none">
      <div class="login-brand">
        <q-avatar rounded color="primary" text-color="white">
          <Zap :size="22" />
        </q-avatar>
        <span class="login-brand__name">FlashMenu</span>
      </div>
      <div class="text-subtitle2 text-grey-7 q-mt-sm">Acesse o painel do seu restaurante</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="handleLogin">
        <q-input
          v-model="email"
          outlined
          dense
          type="email"
          label="E-mail"
          autocomplete="email"
          class="q-mb-md"
        >
          <template #prepend>
            <q-icon name="mail_outline" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          outlined
          dense
          :type="showPassword ? 'text' : 'password'"
          label="Senha"
          autocomplete="current-password"
        >
          <template #prepend>
            <q-icon name="lock_outline" />
          </template>
          <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <q-btn
          type="submit"
          color="primary"
          unelevated
          no-caps
          class="full-width q-mt-lg login-btn"
          label="Entrar"
          :loading="loading"
        />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Zap } from 'lucide-vue-next'
import { login } from 'src/api/login'
import { useAuthStore } from 'src/stores/auth'
import { notifyError } from 'src/util/notify'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    notifyError('Preencha e-mail e senha')
    return
  }

  loading.value = true
  try {
    const data = await login({ email: email.value, password: password.value })
    authStore.setToken(data.token)
    router.push('/dashboard')
  } catch (error) {
    const message = error?.response?.data?.message || 'Verifique seus dados e tente novamente.'
    notifyError('Falha ao entrar', message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-card {
  border-radius: 16px;
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.login-brand__name {
  font-size: 1.4rem;
  font-weight: 700;
}

.login-btn {
  border-radius: 12px;
  height: 44px;
  font-weight: 600;
}
</style>
