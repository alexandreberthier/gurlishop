<template>
  <div ref="selectWrapper" class="select-wrapper">
    <div
        @click="toggleOptions"
        class="selected-options">
      <div v-if="!optionSelected" class="nothing-selected">
        <p>Filtern nach Kategorien</p>
        <div class="icon-wrapper">
          <img :src="getImage('ic_filter.png')" alt="">
        </div>
      </div>
      <div v-else class="selected"
           v-for="(selectedOption, index) in selectedOptions"
           @click="deleteOption(selectedOption)"
           :key="index"
      >
        {{ selectedOption.label }}
        <div class="icon-wrapper">
          <img :src="getImage('ic_delete.png')" alt="">
        </div>
      </div>
    </div>
    <div v-if="showOptions" class="options-wrapper">
      <div
          v-for="(option, index) in options"
          :key="index"
          @click="selectOption(option)"
          class="option"
      >
        <p>{{ option.label }}</p>
        <div
            v-if="selectedOptions.includes(option)"
            class="icon-wrapper">
          <img :src="getImage('ic_checkmark.png')" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {getImage} from "@/utils/ImageUtils";
import type {Option} from "@/models/PropInterfaces";
import {computed, type ModelRef, onBeforeUnmount, onMounted, type Ref, ref} from "vue";

const {options} = defineProps<{
  options: Option[]
}>()

const selectWrapper = ref<HTMLElement>()

const showOptions: Ref<boolean> = ref(false)
const selectedOptionValues: ModelRef<string[] | undefined> = defineModel('selectedOptions')

const selectedOptions = computed(() => {
  return options.filter(option => selectedOptionValues.value?.includes(option.value));
});

function selectOption(option: Option) {
  const values = new Set(selectedOptionValues.value || []);
  values.has(option.value) ? values.delete(option.value) : values.add(option.value);
  selectedOptionValues.value = Array.from(values);
}

function deleteOption(selectedOption: Option) {
  selectedOptionValues.value = selectedOptionValues.value?.filter(value => value !== selectedOption.value) || [];
}

const optionSelected = computed(() => {
  return selectedOptions.value.length > 0;
});

function toggleOptions() {
  showOptions.value = !showOptions.value;
}

function handleOutsideClick(event: Event) {
  if (selectWrapper.value && !selectWrapper.value.contains(event.target as Node)) {
    showOptions.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
});

</script>


<style scoped>

.select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  border: 1px solid var(--black);
  border-radius: 4px;
  width: 100%;
  padding: 5px 10px;

  .selected-options {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    height: 40px;

    .nothing-selected {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 20px;
          height: 20px;
        }
      }
    }

    .selected {
      background: var(--light-gray);
      box-sizing: border-box;
      padding: 5px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;

      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 15px;
          height: 15px;
        }
      }
    }
  }

  .options-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}

</style>