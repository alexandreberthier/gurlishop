<template>
  <component
      class="button"
      :is="isRouterLink ? 'router-link' : 'button'"
      v-bind="isRouterLink && pathName ? {to: {name: pathName, hash: routeHash}} : null"
  >
    <p v-if="!isLoading"> {{ text }}</p>
    <div v-else class="loader"></div>
    <div v-if="isRouterLink" class="icon-wrapper">
      <img :src="getImage('ic_chevron_right_white.png')" alt="">
    </div>

  </component>
</template>

<script setup lang="ts">

import {getImage} from "@/utils/ImageUtils";

const {text, isRouterLink, pathName, routeHash} = defineProps<{
  text: string
  isRouterLink?: boolean
  pathName?: string,
  routeHash?: string
  isLoading?: boolean
}>()


</script>

<style scoped>

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: var(--black);
  border: none;
  height: 50px;
  cursor: pointer;
  position: relative;
  transition: all 250ms ease-in-out;

  &:hover {
    opacity: 0.7;
  }

  &:hover .icon-wrapper {
    transform: translateX(70px);
  }

  p {
    color: var(--white);

  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(50px);
    transition: all 250ms ease-in-out;

    img {
      width: 20px;
      height: 20px;
    }
  }

  .loader {
    height: 20px;
    width: 20px;
    border: 4px solid transparent;
    border-top: 4px solid var(--white);
    border-radius: 50%;
    animation: spin 1s linear infinite;

  }
}


@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>