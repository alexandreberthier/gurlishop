<template>
  <div class="footer-wrapper">
    <div class="link-wrapper">
      <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="{name: link.path}">
        <span>{{ link.linkName }}</span>
      </router-link>
    </div>
    <div class="socials">
      <a
          class="social"
          v-for="(social, index) in socials"
          :key="index"
          :href="social.link">
        <img :src="getImage(social.icon)" alt="">
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">

import {type Ref, ref} from "vue";
import type {Link} from "@/models/PropInterfaces";
import {getImage} from "@/utils/ImageUtils";

const links: Ref<Link[]> = ref([
  {linkName: 'Kontakt', path: 'contact'},
  {linkName: 'Faq', path: 'faq'},
  {linkName: 'Impressum', path: 'imprint'},
])

const socials = ref([
  {icon: 'ic_facebook.png', link: 'https://www.facebook.com'},
  {icon: 'ic_insta.png', link: 'https://www.instagram.com'},
  {icon: 'ic_pintarest.png', link: 'https://www.pintarest.com'},
])


</script>

<style scoped>

.footer-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: var(--black);
  box-sizing: border-box;
  padding: 30px 50px;

  .link-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    a {
      color: var(--white);

      span {
        box-sizing: border-box;
        border-bottom: 2px solid transparent;
      }

      &.active {
        span {
          border-bottom: 2px solid var(--white)
        }
      }

    }
  }

  .socials {
    display: flex;
    align-items: center;
    gap: 16px;

    .social {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 30px;
        width: 30px;
      }
    }
  }
}


@media (min-width: 740px) {
  .footer-wrapper {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 40px 50px;

    .link-wrapper {
      flex-direction: row;
      gap: 32px;
    }

  }
}

</style>