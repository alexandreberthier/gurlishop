<template>
  <StaticLayout>
    <div class="nav">
      <router-link :to="{name: 'user-data'}">
        <span>Meine Daten</span>
      </router-link>
      <router-link :to="{name: 'user-orders'}">
        <span>Meine Bestellungen</span>
      </router-link>
    </div>
    <RouterView/>
  </StaticLayout>
</template>

<script setup lang="ts">

import StaticLayout from "@/views/layout/StaticLayout.vue";

</script>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: 32px;

  a.active {
    background: lavender;
  }
}
</style>
