<template>
  <div>
    <h1>Alle Bestellungen</h1>
    <ul>
      <li v-for="order in adminOrders" :key="order.id">
        <p>Bestellung Nr.: {{ order.id }}</p>
        <p>Status: {{ order.status }}</p>
        <p>Gesamt: {{ order.totalAmount }} €</p>
        <p>Erstellt am: {{ order.createdAt }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import {onMounted} from "vue";

const authStore = useAuthStore();

const adminOrders = authStore.adminOrders;

onMounted(() => {
  authStore.fetchAllOrders();
});
</script>
