<template>
  <q-page padding>
    <AppPageHeader title="Configurações" subtitle="Perfil e aparência do seu restaurante">
      <template v-if="!loading" #actions>
        <q-btn
          unelevated
          no-caps
          color="primary"
          label="Salvar alterações"
          :loading="savingProfile"
          :disable="logoUploading || hoursInvalid || !hasChanges"
          @click="saveProfile"
        />
      </template>
    </AppPageHeader>

    <div class="settings" style="position: relative; min-height: 200px">
      <q-inner-loading :showing="loading">
        <q-spinner color="primary" size="40px" />
      </q-inner-loading>

      <div v-if="!loading" class="settings__grid">
        <!-- Perfil + Aparência + Horário + Vitrine em grade (linhas alinhadas em altura) -->
        <q-form ref="profileForm" class="settings__profile-grid" @submit.prevent="saveProfile">
          <!-- Linha 1: Vitrine | Aparência -->
          <section class="fm-card settings__card">
            <header class="settings__card-head">
              <Globe :size="16" color="var(--fm-brand)" />
              <p class="fm-label settings__card-title">Vitrine pública</p>
            </header>

            <div class="storefront">
              <div class="storefront__url">{{ publicUrl }}</div>
              <div class="storefront__actions">
                <q-btn
                  type="button"
                  outline
                  no-caps
                  :color="copied ? 'positive' : 'primary'"
                  class="copy-btn"
                  @click="copyLink"
                >
                  <component
                    :is="copied ? Check : Copy"
                    :size="15"
                    class="q-mr-xs"
                    :class="{ 'copy-btn__icon--pop': copied }"
                  />
                  Copiar
                </q-btn>
                <q-btn
                  flat
                  no-caps
                  color="primary"
                  type="a"
                  :href="`/${slug}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink :size="15" class="q-mr-xs" />
                  Ver vitrine
                </q-btn>
              </div>
            </div>
            <p class="storefront__hint">O QR code para impressão fica no Dashboard.</p>
          </section>

          <section class="fm-card settings__card">
            <header class="settings__card-head">
              <Palette :size="16" color="var(--fm-brand)" />
              <p class="fm-label settings__card-title">Aparência</p>
            </header>

            <p class="settings__field-label">Cor primária da vitrine</p>
            <q-input
              v-model="form.primaryColor"
              outlined
              dense
              readonly
              class="color-field"
              :rules="[(val) => /^#[0-9a-fA-F]{6}$/.test(val) || 'Cor inválida']"
            >
              <template #prepend>
                <span class="color-swatch" :style="{ background: form.primaryColor }" />
              </template>
              <template #append>
                <q-icon name="colorize" class="cursor-pointer" color="grey-7">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-color
                      v-model="form.primaryColor"
                      format-model="hex"
                      no-header-tabs
                      default-view="palette"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </section>

          <!-- Linha 2: Perfil | Horário -->
          <section class="fm-card settings__card">
            <header class="settings__card-head">
              <Store :size="16" color="var(--fm-brand)" />
              <p class="fm-label settings__card-title">Perfil</p>
            </header>

            <p class="settings__field-label">Logo</p>
            <AppImageUpload
              v-model="form.logo"
              class="form-field"
              @uploading="(v) => (logoUploading = v)"
            />

            <q-input
              v-model="form.name"
              label="Nome do restaurante"
              outlined
              dense
              maxlength="100"
              counter
              class="form-field"
              :rules="[(val) => (val && val.trim().length >= 2) || 'Nome deve ter ao menos 2 caracteres']"
            />

            <q-input
              v-model="form.slug"
              label="Endereço da vitrine"
              outlined
              dense
              maxlength="60"
              class="form-field"
              :rules="[(val) => (val && val.trim().length >= 2) || 'Informe o endereço da vitrine']"
            >
              <template #append>
                <q-icon name="info_outline" class="slug-info" color="grey-6">
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    class="slug-tooltip"
                    :offset="[0, 8]"
                    max-width="280px"
                  >
                    Endereço público do seu cardápio:
                    <strong>{{ previewUrl }}</strong>. Use apenas letras, números e hífens.
                    <span class="slug-tooltip__warn">
                      <TriangleAlert :size="14" class="slug-tooltip__warn-icon" />
                      <span>Ao alterar, os QR codes já impressos deixarão de funcionar.</span>
                    </span>
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>

            <q-input
              v-model="form.description"
              label="Descrição (opcional)"
              type="textarea"
              autogrow
              outlined
              dense
              maxlength="500"
              counter
              class="form-field"
            />

            <q-input
              :model-value="email"
              label="E-mail de acesso"
              outlined
              dense
              disable
              class="form-field"
            />
          </section>

          <section class="fm-card settings__card">
            <header class="settings__card-head">
              <Clock :size="16" color="var(--fm-brand)" />
              <p class="fm-label settings__card-title">Horário de funcionamento</p>
            </header>

            <OpeningHoursEditor v-model="form.openingHours" />
          </section>
        </q-form>

        <!-- Senha (faixa full-width, campos lado a lado no desktop) -->
        <q-form ref="passwordForm" @submit.prevent="savePassword">
          <section class="fm-card settings__card">
            <header class="settings__card-head">
              <Lock :size="16" color="var(--fm-brand)" />
              <p class="fm-label settings__card-title">Senha</p>
            </header>

            <div class="password-grid">
              <q-input
                v-model="password.current"
                :type="showCurrent ? 'text' : 'password'"
                label="Senha atual"
                outlined
                dense
                :rules="[(val) => !!val || 'Informe a senha atual']"
              >
                <template #append>
                  <q-icon
                    :name="showCurrent ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-7"
                    @click="showCurrent = !showCurrent"
                  />
                </template>
              </q-input>

              <q-input
                v-model="password.next"
                :type="showNext ? 'text' : 'password'"
                label="Nova senha"
                outlined
                dense
                :rules="[(val) => (val && val.length >= 8) || 'A senha deve ter ao menos 8 caracteres']"
              >
                <template #append>
                  <q-icon
                    :name="showNext ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-7"
                    @click="showNext = !showNext"
                  />
                </template>
              </q-input>

              <q-input
                v-model="password.confirm"
                :type="showNext ? 'text' : 'password'"
                label="Confirmar nova senha"
                outlined
                dense
                :rules="[(val) => val === password.next || 'As senhas não coincidem']"
              />
            </div>

            <div class="settings__save-bar">
              <q-btn
                unelevated
                no-caps
                color="primary"
                label="Alterar senha"
                type="submit"
                :loading="savingPassword"
              />
            </div>
          </section>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  Globe,
  Copy,
  Check,
  ExternalLink,
  Store,
  Palette,
  Clock,
  Lock,
  TriangleAlert,
} from 'lucide-vue-next'
import AppPageHeader from 'src/components/ui/AppPageHeader.vue'
import AppImageUpload from 'src/components/ui/AppImageUpload.vue'
import OpeningHoursEditor from 'src/components/settings/OpeningHoursEditor.vue'
import { getMyRestaurant, updateMyRestaurant, updateMyPassword } from 'src/api/restaurant'
import { useAuthStore } from 'src/stores/auth'
import { notifySuccess, notifyError } from 'src/util/notify'

document.title = 'Configurações — FlashMenu'

const authStore = useAuthStore()

const loading = ref(true)
const savingProfile = ref(false)
const savingPassword = ref(false)
const logoUploading = ref(false)
const showCurrent = ref(false)
const showNext = ref(false)
const copied = ref(false)
let copiedTimeout = null

const profileForm = ref(null)
const passwordForm = ref(null)

const slug = ref('')
const email = ref('')

const form = reactive({
  name: '',
  slug: '',
  description: '',
  logo: null,
  primaryColor: '#166534',
  openingHours: null,
})

// Mesma normalização do backend (src/core/slug.js), para pré-visualizar o endereço final
function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const password = reactive({ current: '', next: '', confirm: '' })

let initialSnapshot = '{}'

const publicUrl = computed(() => `${window.location.origin}/${slug.value}`)

const previewUrl = computed(() => `${window.location.origin}/${slugify(form.slug)}`)

const hasChanges = computed(() => snapshot() !== initialSnapshot)

const hoursInvalid = computed(() => {
  const hours = form.openingHours
  if (!hours) return false
  return Object.values(hours).some(
    (d) => d && !d.closed && (!d.open || !d.close || d.open >= d.close),
  )
})

function snapshot() {
  return JSON.stringify({
    name: form.name,
    slug: form.slug,
    description: form.description,
    logo: form.logo,
    primaryColor: form.primaryColor,
    openingHours: form.openingHours,
  })
}

function applyRestaurant(r) {
  slug.value = r.slug
  email.value = r.email
  form.name = r.name ?? ''
  form.slug = r.slug ?? ''
  form.description = r.description ?? ''
  form.logo = r.logo ?? null
  form.primaryColor = r.primaryColor ?? '#166534'
  form.openingHours = r.openingHours ?? null
  initialSnapshot = snapshot()
}

async function fetchRestaurant() {
  loading.value = true
  try {
    const res = await getMyRestaurant()
    applyRestaurant(res.data)
  } catch {
    notifyError('Erro ao carregar as configurações')
  } finally {
    loading.value = false
  }
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(publicUrl.value)
    copied.value = true
    clearTimeout(copiedTimeout)
    copiedTimeout = setTimeout(() => (copied.value = false), 1800)
    notifySuccess('Link copiado')
  } catch {
    notifyError('Não foi possível copiar o link')
  }
}

async function saveProfile() {
  const valid = await profileForm.value.validate()
  if (!valid || hoursInvalid.value) return
  savingProfile.value = true
  try {
    const res = await updateMyRestaurant({
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description?.trim() || undefined,
      logo: form.logo || undefined,
      primaryColor: form.primaryColor,
      openingHours: form.openingHours || undefined,
    })
    authStore.setSession({ token: authStore.token, restaurant: res.data })
    applyRestaurant(res.data)
    notifySuccess('Alterações salvas')
  } catch (err) {
    notifyError(err?.response?.data?.message ?? 'Erro ao salvar')
  } finally {
    savingProfile.value = false
  }
}

async function savePassword() {
  const valid = await passwordForm.value.validate()
  if (!valid) return
  savingPassword.value = true
  try {
    await updateMyPassword({
      currentPassword: password.current,
      newPassword: password.next,
    })
    password.current = ''
    password.next = ''
    password.confirm = ''
    passwordForm.value.resetValidation()
    notifySuccess('Senha alterada com sucesso')
  } catch (err) {
    notifyError(err?.response?.data?.message ?? 'Erro ao alterar a senha')
  } finally {
    savingPassword.value = false
  }
}

fetchRestaurant()
</script>

<style scoped>
.settings__grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Grade de cards: uma coluna no mobile, duas no desktop.
   align-items: stretch (padrão do grid) faz os cards da mesma linha terem altura igual. */
.settings__profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 1024px) {
  .settings__profile-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}


.settings__card {
  padding: 20px;
  margin-bottom: 0;
}

.settings__card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.settings__card-title {
  margin: 0;
}

.settings__field-label {
  margin: 0 0 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--fm-text-secondary);
}

.form-field + .form-field {
  margin-top: 14px;
}

.slug-info {
  cursor: help;
}

.slug-tooltip {
  font-size: 0.8125rem;
  line-height: 1.5;
}

.slug-tooltip strong {
  font-weight: 700;
  word-break: break-all;
}

.slug-tooltip__warn {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  font-weight: 700;
}

.slug-tooltip__warn-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.settings__save-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.storefront {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.storefront__url {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--fm-text-primary);
  word-break: break-all;
}

.storefront__actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.storefront__hint {
  margin: 12px 0 0;
  font-size: 0.75rem;
  color: var(--fm-text-tertiary);
}

.copy-btn {
  transition: color var(--fm-transition), border-color var(--fm-transition);
}

.copy-btn__icon--pop {
  animation: copy-pop 0.3s ease;
}

@keyframes copy-pop {
  0% {
    transform: scale(0.6);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

.color-swatch {
  width: 18px;
  height: 18px;
  border-radius: var(--fm-radius-xs);
  border: 1px solid var(--fm-border-strong);
  display: inline-block;
}

/* Senha: campos empilhados no mobile, lado a lado no desktop */
.password-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

@media (min-width: 1024px) {
  .password-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
}

@media (max-width: 599px) {
  .storefront__actions {
    width: 100%;
  }
}
</style>
