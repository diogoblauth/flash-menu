<template>
  <div>
    <div class="auth-heading">
      <h2 class="auth-heading__title">Entrar</h2>
      <p class="auth-heading__sub">Acesse o painel do seu restaurante</p>
    </div>

    <q-form class="auth-form-body" @submit.prevent="handleLogin">
      <q-input
        v-model="email"
        outlined
        dense
        type="email"
        label="E-mail"
        autocomplete="email"
        class="q-mb-sm"
      >
        <template #prepend>
          <q-icon name="mail_outline" size="18px" />
        </template>
      </q-input>

      <q-input
        v-model="password"
        outlined
        dense
        :type="showPassword ? 'text' : 'password'"
        label="Senha"
        autocomplete="current-password"
        class="q-mb-lg"
      >
        <template #prepend>
          <q-icon name="lock_outline" size="18px" />
        </template>
        <template #append>
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            size="18px"
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
        class="full-width auth-submit-btn"
        label="Entrar"
        :loading="loading"
      />
    </q-form>

    <p class="auth-switch">
      Ainda não tem conta?
      <router-link to="/cadastro" class="auth-switch__link">Criar conta</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from 'src/api/auth'
import { useAuthStore } from 'src/stores/auth'
import { notifyError } from 'src/util/notify'

document.title = 'FlashMenu — Entrar'

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
    authStore.setSession(data)
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
.auth-heading {
  margin-bottom: 28px;
}

.auth-heading__title {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--fm-text-primary);
  margin: 0 0 6px;
}

.auth-heading__sub {
  font-size: 0.875rem;
  color: var(--fm-text-secondary);
  margin: 0;
}

.auth-form-body {
  display: flex;
  flex-direction: column;
}

.auth-submit-btn {
  height: 42px;
  font-size: 0.9375rem;
  letter-spacing: 0.01em;
}

.auth-switch {
  margin-top: 20px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--fm-text-secondary);
}

.auth-switch__link {
  color: var(--fm-brand);
  font-weight: 600;
  text-decoration: none;
}

.auth-switch__link:hover {
  color: var(--fm-brand-hover);
  text-decoration: underline;
}
</style>
