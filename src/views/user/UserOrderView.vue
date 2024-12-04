<template>
  <div class="wrapper">
    <ul>
      <li v-for="order in orders" :key="order.id">
        <p>Bestellung Nr. {{ order.id }}</p>
        <p>Status: {{ order.status }}</p>
        <p>Total: {{ order.totalAmount }} €</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {onMounted, computed} from "vue";
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore();

const orders = computed(() => authStore.user?.orders || []);

onMounted(() => {
  authStore.fetchUserOrders();
})
</script>
