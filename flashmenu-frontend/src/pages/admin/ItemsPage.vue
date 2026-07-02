<template>
  <q-page padding>
    <AppPageHeader title="Itens" subtitle="Gerencie os pratos e bebidas do cardápio">
      <template v-if="items.length > 0" #actions>
        <q-btn unelevated no-caps color="primary" label="Novo item" @click="openCreate" />
      </template>
    </AppPageHeader>

    <div style="position: relative; min-height: 120px">
      <q-inner-loading :showing="loadingList">
        <q-spinner color="primary" size="40px" />
      </q-inner-loading>

      <AppEmptyState
        v-if="!loadingList && items.length === 0"
        icon="restaurant_menu"
        title="Nenhum item ainda"
        description="Cadastre os pratos e bebidas do seu cardápio, com preço, foto e categoria."
        action-label="Criar primeiro item"
        action-icon="add"
        @action="openCreate"
      />

      <div v-if="!loadingList && items.length > 0" class="item-groups">
        <div v-for="group in groups" :key="group.key" class="item-group">
          <p class="fm-label group-title">{{ group.name }}</p>

          <draggable
            :model-value="group.items"
            item-key="id"
            handle=".drag-handle"
            :animation="150"
            @update:model-value="(list) => onDragUpdate(group.key, list)"
            @end="() => onReorder(group.key)"
          >
            <template #item="{ element: item }">
              <div class="fm-card item-row" :class="{ 'item-row--inactive': !item.active }">
                <div class="drag-handle">
                  <GripVertical :size="18" color="var(--fm-text-tertiary)" />
                </div>

                <div class="item-photo">
                  <img v-if="item.photo" :src="item.photo" :alt="item.name" @error="onImageError" />
                  <ImageIcon v-else :size="20" color="var(--fm-text-tertiary)" />
                </div>

                <div class="item-info">
                  <div class="item-name-row">
                    <span class="item-name">{{ item.name }}</span>
                    <span v-if="!item.active" class="fm-badge fm-badge--muted">Esgotado</span>
                  </div>
                  <span class="item-price">{{ formatBRL(item.price) }}</span>
                </div>

                <div class="item-actions">
                  <q-toggle
                    :model-value="item.active"
                    color="primary"
                    :disable="togglingId === item.id"
                    @update:model-value="(val) => onToggleActive(item, val)"
                  >
                    <q-tooltip>{{ item.active ? 'Disponível' : 'Esgotado' }}</q-tooltip>
                  </q-toggle>
                  <q-btn flat round dense :loading="editingId === item.id" @click="openEdit(item)">
                    <Pencil :size="16" color="var(--fm-text-secondary)" />
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense :loading="deletingId === item.id" @click="confirmDelete(item)">
                    <Trash2 :size="16" color="var(--fm-danger)" />
                    <q-tooltip>Excluir</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import draggable from 'vuedraggable'
import { GripVertical, Pencil, Trash2, Image as ImageIcon } from 'lucide-vue-next'
import AppPageHeader from 'src/components/ui/AppPageHeader.vue'
import AppEmptyState from 'src/components/ui/AppEmptyState.vue'
import ItemDialog from 'src/components/items/ItemDialog.vue'
import ItemDeleteDialog from 'src/components/items/ItemDeleteDialog.vue'
import { listItems, deleteItem, reorderItems, toggleItemActive } from 'src/api/items'
import { listCategories } from 'src/api/categories'
import { formatBRL } from 'src/util/currency'
import { notifySuccess, notifyError } from 'src/util/notify'

document.title = 'Itens — FlashMenu'

const UNCATEGORIZED_KEY = 'uncategorized'

const $q = useQuasar()
const items = ref([])
const categories = ref([])
const loadingList = ref(true)
const editingId = ref(null)
const deletingId = ref(null)
const togglingId = ref(null)

const groups = computed(() => {
  const sortedCategories = [...categories.value].sort((a, b) => a.sortOrder - b.sortOrder)
  const result = sortedCategories.map((cat) => ({
    key: cat.id,
    name: cat.name,
    items: items.value
      .filter((item) => item.categoryId === cat.id)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  }))

  const uncategorized = items.value
    .filter((item) => item.categoryId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  if (uncategorized.length > 0) {
    result.push({ key: UNCATEGORIZED_KEY, name: 'Sem categoria', items: uncategorized })
  }

  return result.filter((group) => group.items.length > 0)
})

async function fetchData() {
  loadingList.value = true
  try {
    const [itemsRes, categoriesRes] = await Promise.all([listItems(), listCategories()])
    items.value = itemsRes.data.items
    categories.value = categoriesRes.data.categories
  } catch {
    notifyError('Erro ao carregar itens')
  } finally {
    loadingList.value = false
  }
}

function openCreate() {
  $q.dialog({ component: ItemDialog, componentProps: { item: null } }).onOk((created) => {
    items.value.push(created)
  })
}

function openEdit(item) {
  editingId.value = item.id
  $q.dialog({ component: ItemDialog, componentProps: { item } })
    .onOk((updated) => {
      const idx = items.value.findIndex((i) => i.id === updated.id)
      if (idx !== -1) items.value[idx] = { ...items.value[idx], ...updated }
    })
    .onDismiss(() => {
      editingId.value = null
    })
}

function confirmDelete(item) {
  $q.dialog({ component: ItemDeleteDialog, componentProps: { itemName: item.name } }).onOk(() =>
    handleDelete(item),
  )
}

async function handleDelete(item) {
  deletingId.value = item.id
  try {
    await deleteItem(item.id)
    items.value = items.value.filter((i) => i.id !== item.id)
    notifySuccess('Item excluído')
  } catch (err) {
    notifyError(err?.response?.data?.message ?? 'Erro ao excluir item')
  } finally {
    deletingId.value = null
  }
}

async function onToggleActive(item, active) {
  const previous = item.active
  togglingId.value = item.id
  item.active = active
  try {
    await toggleItemActive(item.id, active)
  } catch {
    item.active = previous
    notifyError('Erro ao atualizar disponibilidade')
  } finally {
    togglingId.value = null
  }
}

function onDragUpdate(groupKey, newGroupItems) {
  const categoryId = groupKey === UNCATEGORIZED_KEY ? null : groupKey
  const otherItems = items.value.filter((item) => item.categoryId !== categoryId)
  items.value = [...otherItems, ...newGroupItems]
}

async function onReorder(groupKey) {
  const categoryId = groupKey === UNCATEGORIZED_KEY ? null : groupKey
  const snapshot = [...items.value]
  const groupItems = items.value.filter((item) => item.categoryId === categoryId)
  const payload = groupItems.map((item, index) => ({ id: item.id, sortOrder: index }))

  groupItems.forEach((item, index) => {
    item.sortOrder = index
  })

  try {
    await reorderItems(payload)
    notifySuccess('Ordem salva')
  } catch {
    items.value = snapshot
    notifyError('Erro ao salvar ordem')
  }
}

function onImageError(event) {
  event.target.style.display = 'none'
}

onMounted(fetchData)
</script>

<style scoped>
.item-groups {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.group-title {
  margin: 0 0 8px 4px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin-bottom: 8px;
  transition: box-shadow var(--fm-transition), opacity var(--fm-transition);
}

.item-row--inactive {
  opacity: 0.6;
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

.item-photo {
  width: 40px;
  height: 40px;
  border-radius: var(--fm-radius-md);
  background: var(--fm-content-bg);
  border: 1px solid var(--fm-border);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.item-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.item-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: var(--fm-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-size: 0.8125rem;
  color: var(--fm-text-secondary);
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
</style>
