<template>
  <div class="wrapper">
    <ul>
      <li v-for="order in orders" :key="order.id">
        <p>Bestellung Nr. {{ order.id }}</p>
        <p>Status: {{ order.status }}</p>
        <p>Total: {{ order.totalAmount }} €</p>
      </li>
    </ul>
    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const orders = authStore.user?.orders || [];
const successMessage = ref(authStore.successMessage);
const errorMessage = ref(authStore.errorMessage);

onMounted(() => {
  authStore.fetchUserOrders();
})
</script>
