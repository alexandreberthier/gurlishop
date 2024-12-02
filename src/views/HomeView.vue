<template>
  <StaticLayout>
    <div class="filter-section">
      <DynamicInput
          label=""
          :input-type="InputType.Search"
          v-model:user-input="searchInput"
      />
      <div class="category-flex">
        <DynamicMultiSelect
            v-model:selected-options="selectedCategories"
            :options="categoryOptions"
        />
      </div>
    </div>
    <div v-if="filteredItems.length > 0" class="item-flex">
      <ProductCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
      />
    </div>
    <p v-else>Keine Ergebnisse für <b>{{ searchInput }}</b></p>
  </StaticLayout>
</template>

<script setup lang="ts">

import StaticLayout from "@/views/layout/StaticLayout.vue";
import {computed, type ComputedRef, type Ref, ref} from "vue";
import ProductCard from "@/components/ProductCard.vue";
import {useProductStore} from "@/stores/product";
import {Category, Item} from "@/models/Item";
import DynamicInput from "@/components/DynamicInput.vue";
import {InputType} from "@/models/InputType";
import DynamicMultiSelect from "@/components/DynamicMultiSelect.vue";
import type {Option} from "@/models/PropInterfaces";

const productStore = useProductStore()

const searchInput: Ref<string> = ref('')
const selectedCategories: Ref<string[]> = ref([])

const items: ComputedRef<Item[]> = computed(() => {
  return productStore.items.map(item => Item.fromDto(item))
})

const filteredItems = computed(() => {
  const filteredBySearchInput = items.value.filter(item =>
      item.displayName.toLowerCase().includes(searchInput.value.toLowerCase())
  )
  if (selectedCategories.value.length === 0) {
    return filteredBySearchInput;
  }

  return filteredBySearchInput.filter(item =>
      selectedCategories.value.includes(item.category)
  );
});


const categoryOptions: Ref<Option[]> = ref([
  {
    label: 'Taschen',
    value: Category.Bags
  },
  {
    label: 'Socken',
    value: Category.Socks
  },
  {
    label: 'Decken',
    value: Category.Blankets
  },
])

</script>

<style scoped>

.filter-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-flex {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 64px;
  justify-content: center;
}

@media (min-width: 1200px) {
  .filter-section {
    width: 100%;
    flex-direction: row;
    gap: 32px;
    justify-content: left;

    > * {
      width: 300px;
    }
  }

  .item-flex {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 80px;
    justify-content: center;
  }
}

</style>