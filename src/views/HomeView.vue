<template>
  <StaticLayout>
    <div class="filter-section">
      <DynamicInput
          label=""
          :input-type="InputType.Search"
          v-model:user-input="searchInput"
      />
      <div class="category-flex">
        <div
            v-for="(category, index) in categories"
            :key="index"
            @click="selectCategory(category.value)"
            :class="['category', {'selected': selectedCategories.includes(category.value)}]">
          {{ category.label }}
        </div>
      </div>
    </div>
    <div v-if="filteredItems.length > 0" class="item-flex">
      <ProductCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
      />
    </div>
    <p v-else>Keine Ergebnisse für <b>{{searchInput}}</b> </p>
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


function selectCategory(category: string) {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter(c => c !== category);
  } else {
    selectedCategories.value = [...new Set([...selectedCategories.value, category])];
  }
}


const categories = ref([
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

  .category-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .category {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px 10px;
      box-sizing: border-box;
      border:1px solid black;
      cursor: pointer;

      &.selected {
        background: lavender;
        font-weight: 700;
      }
    }
  }
}

.item-flex {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;


}

</style>