<template>
  <StaticLayout>
    <router-view v-slot="{ Component }">
      <component v-if="Component" ref="comp" :is="Component"></component>
    </router-view>
    <div class="button-section">
      <DynamicButton text="Weiter"/>
      <DynamicButton text="Zurück"/>
    </div>
  </StaticLayout>
</template>

<script setup lang="ts">

import StaticLayout from "@/views/layout/StaticLayout.vue";
import {type Ref, ref} from "vue";
import DynamicButton from "@/components/DynamicButton.vue";

interface ValidationComponent {
  validateInputFields: () => boolean
}

const comp: Ref<ValidationComponent | null> = ref(null)
</script>

<style scoped>

.button-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>