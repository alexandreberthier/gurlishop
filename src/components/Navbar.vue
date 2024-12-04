<template>
  <div :class="['nav-wrapper', { 'scrolled': isScrollingDown }]">
    <router-link
        @click="navbarStore.closeMenu(), cartStore.hideCartSlider()"
        :to="{name: 'home'}">
      <div class="logo">
        <img :src="getImage('gurli_logo.png')" alt="">
      </div>
    </router-link>
    <div :class="['links', {'open': navbarStore.menuOpen}]">
      <router-link
          @click="navbarStore.closeMenu(), cartStore.hideCartSlider()"
          v-for="(link, index) in links"
          :key="index"
          :to="{name: link.linkPath}">
        <span>{{ link.linkName }}</span>
      </router-link>
    </div>
    <div class="icon-section">
      <router-link
          @click="cartStore.hideCartSlider(),  navbarStore.closeMenu()"
          :to="{name:  userRoute}">
        <div class="icon-wrapper">
          <img :src="getImage('ic_user.png')" alt="Einloggen, Registrieren, Account ">
        </div>
      </router-link>
      <div v-if="isLoggedIn"
           @click="authStore.logout()"
           class="icon-wrapper">
        <img :src="getImage('ic_logout.png')" alt="Ausloggen">
      </div>
      <div
          @click="cartStore.toggleCartSlider(), navbarStore.closeMenu()"
          class="icon-wrapper">
        <img :src="getImage('ic_cart.png')" alt="Warenkorb">
      </div>
      <div
          @click="navbarStore.toggleMenu() , cartStore.hideCartSlider()"
          role="button"
          :class="['hamburger-menu', {'open': navbarStore.menuOpen}]">
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getImage} from "@/utils/ImageUtils";
import {computed, onMounted, onUnmounted, type Ref, ref} from "vue";
import {useAuthStore} from "@/stores/auth";
import {useNavbarStore} from "@/stores/navbar";
import {useCartStore} from "@/stores/cartStore";

const authStore = useAuthStore()
const navbarStore = useNavbarStore()
const cartStore = useCartStore()

const isLoggedIn = computed(() => {
  return authStore.isLoggedIn
})

const userRoute = computed(() => {
  if (authStore.isLoggedIn) {
    return authStore.isAdmin ? 'admin' : 'user';
  } else {
    return 'auth';
  }
});


const links = ref([
  {linkName: 'Kontakt', linkPath: 'contact'},
  {linkName: 'Faq', linkPath: 'faq'},
])

const isScrollingDown = ref(false);
let lastScrollY = 0;
let scrollTimeout: number | undefined = undefined;

const handleScroll = () => {
  const currentScrollY = window.scrollY;

  isScrollingDown.value = currentScrollY > lastScrollY;
  lastScrollY = currentScrollY;

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrollingDown.value = false;
  }, 200);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  clearTimeout(scrollTimeout);
});
</script>

<style scoped>

.nav-wrapper {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--white);
  transition: all 250ms ease-in-out;

  &.scrolled {
    height: 110px;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 140px;
      height: auto;
    }
  }

  .links {
    display: flex;
    flex-direction: column;
    gap: 32px;
    position: fixed;
    left: 0;
    top: 100px;
    width: 100%;
    background: var(--white);
    height: 100%;
    box-sizing: border-box;
    padding: 50px;
    transition: all 250ms ease-in-out;
    opacity: 0;
    transform: translateX(-100%);

    &.open {
      opacity: 1;
      transform: translateX(0%);
    }

    a {
      font-size: 26px;

      span {
        box-sizing: border-box;
        padding: 5px 10px;
      }

      &.active {
        span {
          background: lavender;
        }
      }
    }
  }

  .icon-section {
    display: flex;
    align-items: center;
    gap: 16px;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      img {
        width: 30px;
        height: 30px;
      }
    }
  }

  .hamburger-menu {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.open {
      span {
        background: transparent;

        &:after {
          top: 0;
          transform: rotate(45deg);
        }

        &:before {
          bottom: 0;
          transform: rotate(-45deg);
        }
      }
    }

    span {
      width: 100%;
      height: 2px;
      background: var(--black);
      position: relative;
      transition: all 250ms ease-in-out;

      &:after, &:before {
        content: '';
        width: 100%;
        height: 2px;
        background: var(--black);
        position: absolute;
        transition: all 250ms ease-in-out;
      }

      &:after {
        top: 8px;
      }

      &:before {
        bottom: 8px;
      }
    }
  }
}

@media(min-width: 740px){
  .nav-wrapper {
    height: 120px;
    padding: 0 20px;

    .logo {
      img {
        width: 150px;
        height: auto;
      }
    }

    .links {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 32px;
      position: static;
      height: unset;
      padding: 0;
      opacity: 1;
      transform: translateX(0);

      a {
        font-size: 22px;
      }
    }

    .icon-section {
      gap: 32px;
    }

    .hamburger-menu {
      display: none;
    }
  }
}

</style>