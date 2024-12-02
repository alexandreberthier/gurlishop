<template>
  <div class="outer-wrapper">
    <router-link :to="{name: 'details', params: {id: item.id}}">
      <div class="card-wrapper">
        <div class="image-wrapper">
          <img :src="getImage(item.images[0])" alt="">
          <div class="hover-text">
            <p>Details</p>
          </div>
        </div>
        <div class="product-info">
          <p>{{ item.displayName }}</p>
          <p>{{ item.getFormattedItemPrice() }}</p>
        </div>
      </div>
    </router-link>
    <DynamicButton
        @click="cartStore.addProduct(item, quantity)"
        text="In den Warenkorb"
    />
  </div>
</template>

<script setup lang="ts">

import {getImage} from "@/utils/ImageUtils";
import DynamicButton from "@/components/DynamicButton.vue";
import type {Item} from "@/models/Item";
import {useCartStore} from "@/stores/cartStore";
import {type Ref, ref} from "vue";

const {item} = defineProps<{
  item: Item
}>()

const cartStore = useCartStore()
const quantity: Ref<number> = ref(1)


</script>

<style scoped>

.outer-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 320px;
  height: 400px;

  &:hover .image-wrapper .hover-text {
    transform: translateY(0%);
  }

  .image-wrapper {
    background-color: var(--light-gray);
    overflow: hidden;
    width: 320px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;


    .hover-text {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.4);
      position: absolute;
      bottom: 0;
      height: 40px;
      width: 100%;
      transform: translateY(100%);
      transition: all 250ms ease-in-out;

      p {
        font-size: 14px;
      }
    }

    img {
      width: 260px;
      height: auto;
    }
  }

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
}


</style>