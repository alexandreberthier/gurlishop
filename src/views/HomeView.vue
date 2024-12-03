<template>
  <StaticLayout>
    <div class="filter-section">
      <DynamicInput
          label=""
          :input-type="InputType.Search"
          v-model:user-input="searchInput"
      />
      <div class="flex">
        <DynamicMultiSelect
            v-model:selected-options="selectedCategories"
            :options="categoryOptions"
        />
        <div
            @click="deleteAllFilters"
            v-if="filterSelected"
            class="delete-filter">
          <img :src="getImage('ic_delete_all.png')" alt="">
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
import {getImage} from "@/utils/ImageUtils";

const productStore = useProductStore()

const searchInput: Ref<string> = ref('')
const selectedCategories: Ref<string[]> = ref([])

const items: ComputedRef<Item[]> = computed(() => {
  return productStore.items.map(item => Item.fromDto(item))
})

const filterSelected = computed(()=> {
  return !!searchInput.value || selectedCategories.value.length > 0
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
})

function deleteAllFilters(){
  searchInput.value = ''
  selectedCategories.value = []
}

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

  .flex {
    display: flex;
    flex-direction: column;
    align-items:flex-end;
    gap: 16px;

    .delete-filter {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      cursor: pointer;
      box-sizing: border-box;
      border: 1px solid var(--black);
      border-radius: 4px;
      flex-shrink: 0;

      img {
        width: 24px;
        height: 24px;
      }
    }

  }
}

.item-flex {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 64px;
  justify-content: center;
}

@media (min-width: 740px) {
  .filter-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .flex {
      display: flex;
      flex-direction: row;
      align-items:center;
    }
  }
}

@media (min-width: 1200px) {
  .filter-section {
    width: 100%;
    flex-direction: row;
    gap: 32px;
    justify-content: left;

    > * {
      width: 400px;
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