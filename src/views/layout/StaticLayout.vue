<template>
  <div class="layout">
    <div class="header-section">
      <h1 v-if="header">{{header}}</h1>
      <p v-if="subHeader" v-html="subHeader"></p>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

const {header, subHeader} = defineProps<{
  header?: string,
  subHeader?:string
}>()

</script>

<style scoped>
.layout{
  width: 320px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;


  .header-section {
    display: flex;
    flex-direction: column;
   align-items: center;
    gap: 16px;
    width: 100%;
  }
}

@media (min-width: 740px) {
  .layout{
    margin: 150px auto;
    width: 620px;
    gap: 64px;
  }
}

@media (min-width: 1200px) {
  .layout{
    width: 920px;
  }
}

@media (min-width: 1440px) {
  .layout{
    width: 1220px;
  }
}



</style>