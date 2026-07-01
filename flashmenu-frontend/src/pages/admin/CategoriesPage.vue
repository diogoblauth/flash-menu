<template>
  <q-page padding>
    <AppPageHeader title="Categorias" subtitle="Organize o cardápio por seções">
      <template v-if="categories.length > 0" #actions>
        <q-btn unelevated no-caps color="primary" label="Nova categoria" @click="openCreate" />
      </template>
    </AppPageHeader>

    <div style="position: relative; min-height: 120px">
      <q-inner-loading :showing="loadingList">
        <q-spinner color="primary" size="40px" />
      </q-inner-loading>

      <AppEmptyState
        v-if="!loadingList && categories.length === 0"
        icon="folder_open"
        title="Nenhuma categoria ainda"
        description="Crie categorias para organizar seu cardápio em seções como Entradas, Pratos, Bebidas..."
        action-label="Criar primeira categoria"
        action-icon="add"
        @action="openCreate"
      />

      <draggable
        v-if="!loadingList && categories.length > 0"
        v-model="categories"
        item-key="id"
        handle=".drag-handle"
        :animation="150"
        @end="onReorder"
      >
        <template #item="{ element: cat }">
          <div class="fm-card category-row">
            <div class="drag-handle">
              <GripVertical :size="18" color="var(--fm-text-tertiary)" />
            </div>

            <div class="category-info">
              <span class="category-name">{{ cat.name }}</span>
              <span class="fm-badge fm-badge--muted">
                {{ cat._count.items }} {{ cat._count.items === 1 ? 'item' : 'itens' }}
              </span>
            </div>

            <div class="category-actions">
              <q-btn
                flat
                round
                dense
                :loading="editingId === cat.id"
                @click="openEdit(cat)"
              >
                <Pencil :size="16" color="var(--fm-text-secondary)" />
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                :loading="deletingId === cat.id"
                @click="confirmDelete(cat)"
              >
                <Trash2 :size="16" color="var(--fm-danger)" />
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import draggable from 'vuedraggable'
import { GripVertical, Pencil, Trash2 } from 'lucide-vue-next'
import AppPageHeader from 'src/components/ui/AppPageHeader.vue'
import AppEmptyState from 'src/components/ui/AppEmptyState.vue'
import CategoryDialog from 'src/components/categories/CategoryDialog.vue'
import CategoryDeleteDialog from 'src/components/categories/CategoryDeleteDialog.vue'
import { listCategories, deleteCategory, reorderCategories } from 'src/api/categories'
import { notifySuccess, notifyError } from 'src/util/notify'

document.title = 'Categorias — FlashMenu'

const $q = useQuasar()
const categories = ref([])
const loadingList = ref(true)
const editingId = ref(null)
const deletingId = ref(null)

async function fetchCategories() {
  loadingList.value = true
  try {
    const res = await listCategories()
    categories.value = res.data.categories
  } catch {
    notifyError('Erro ao carregar categorias')
  } finally {
    loadingList.value = false
  }
}

function openCreate() {
  $q.dialog({ component: CategoryDialog, componentProps: { category: null } }).onOk((created) => {
    categories.value.push({ ...created, _count: { items: 0 } })
  })
}

function openEdit(cat) {
  editingId.value = cat.id
  $q.dialog({ component: CategoryDialog, componentProps: { category: cat } })
    .onOk((updated) => {
      const idx = categories.value.findIndex((c) => c.id === updated.id)
      if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...updated }
    })
    .onDismiss(() => {
      editingId.value = null
    })
}

function confirmDelete(cat) {
  $q.dialog({ component: CategoryDeleteDialog, componentProps: { categoryName: cat.name } }).onOk(
    () => handleDelete(cat),
  )
}

async function handleDelete(cat) {
  deletingId.value = cat.id
  try {
    await deleteCategory(cat.id)
    categories.value = categories.value.filter((c) => c.id !== cat.id)
    notifySuccess('Categoria excluída')
  } catch (err) {
    notifyError(err?.response?.data?.message ?? 'Erro ao excluir categoria')
  } finally {
    deletingId.value = null
  }
}

async function onReorder() {
  const snapshot = [...categories.value]
  const payload = categories.value.map((cat, index) => ({ id: cat.id, sortOrder: index }))
  try {
    await reorderCategories(payload)
    notifySuccess('Ordem salva')
  } catch {
    categories.value = snapshot
    notifyError('Erro ao salvar ordem')
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.category-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  transition: box-shadow var(--fm-transition);
}

.drag-handle {
  cursor: grab;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.drag-handle:active {
  cursor: grabbing;
}

.category-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.category-name {
  font-weight: 600;
  color: var(--fm-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
</style>
