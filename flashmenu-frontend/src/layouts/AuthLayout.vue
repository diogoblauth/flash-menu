<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="auth-page flex flex-center">
        <div class="auth-card">
          <div class="auth-wordmark">
            <span class="auth-wordmark__flash">Flash</span><span class="auth-wordmark__menu">Menu</span>
          </div>
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #FAFAF9;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: #FFFFFF;
  border: 1px solid var(--fm-border);
  border-radius: var(--fm-radius-xl);
  padding: 40px 36px 36px;
  margin: 24px 16px;
}

.auth-wordmark {
  text-align: center;
  font-size: 1.25rem;
  letter-spacing: -0.03em;
  margin-bottom: 32px;
}

.auth-wordmark__flash {
  font-weight: 300;
  color: var(--fm-text-tertiary);
}

.auth-wordmark__menu {
  font-weight: 800;
  color: var(--fm-brand);
}
</style>
