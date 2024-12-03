<template>
  <StaticLayout
      header="Admin Dashboard"
  >
    {{ orders }}
  </StaticLayout>
</template>

<script setup lang="ts">

import StaticLayout from "@/views/layout/StaticLayout.vue";
import {useAuthStore} from "@/stores/auth";
import {computed, onMounted, type Ref, ref} from "vue";
import type {Order} from "@/models/User";

const authStore = useAuthStore()

const orders = computed(() => {
  return authStore.adminOrders
})


onMounted(() => {
  authStore.fetchAllOrders()
})
</script>

<style scoped>

</style>