<template>
  <div class="content">
    <nav>
      <Navbar/>
      <CartNavSlider/>
    </nav>
    <main>
      <RouterView></RouterView>
    </main>
    <footer>
      <Footer/>
    </footer>
  </div>
</template>

<script setup lang="ts">

import {useAuthStore} from "@/stores/auth";
import Navbar from "@/components/Navbar.vue";
import CartNavSlider from "@/components/CartNavSlider.vue";
import Footer from "@/components/Footer.vue";

const authStore = useAuthStore()

authStore.watchUser()

</script>

<style scoped>

.content {
  display: flex;
  flex-direction: column;
  height: 100vh;

  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
  }

  main {
    flex: 1;
  }

}


</style>