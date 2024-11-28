<template>
  <div class="route-wrapper">
    <div class="summary-flex">
      <div v-if="personalData" class="personal-summary">
        <h2>Persönliche Daten</h2>
        <p>{{ personalData.firstName }} {{ personalData.lastName }}</p>
        <p>{{ personalData.email }}</p>
        <p>{{ personalData.phoneNumber }}</p>
      </div>
      <div v-if="deliveryData" class="delivery-summary">
        <h2>Lieferadresse</h2>
        <p>{{ deliveryData.street }} {{ deliveryData.houseNumber }}</p>
        <p>{{ deliveryData.postalCode }} {{ deliveryData.city }}</p>
        <p>{{ deliveryData.country }}</p>
      </div>
    </div>
    <div class="product-summary">
      <h2>Warenkorb</h2>
      <div v-if="cartItems"
           v-for="item in cartItems"
           :key="item.item.id"
           class="item">
        <div class="image-wrapper">
          <img :src="getImage(item.item.images[0])" alt="">
        </div>
        <div class="item-info">
          <p>{{ item.item.displayName }}</p>
          <div class="price">
            <p> {{ item.quantity }} x</p>
            <p> {{ formatPrice(item.item.price) }}</p>
            <p> {{ formatPrice(item.item.price * item.quantity) }}</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import {useCheckoutStore} from "@/stores/checkout";
import {useCartStore} from "@/stores/cartStore";
import {computed} from "vue";
import {getImage} from "@/utils/ImageUtils";
import {formatPrice} from "@/utils/PriceUtils";

const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()

const personalData = computed(() => {
  return checkoutStore.personalData
})

const deliveryData = computed(() => {
  return checkoutStore.deliveryData
})

const cartItems = computed(() => {
  return cartStore.itemsInCart
})

</script>

<style scoped>

.route-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;

  .summary-flex {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .product-summary {
    display: flex;
    flex-direction: column;
    gap: 32px;

    .item {
      display: flex;
      align-items: center;
      gap: 16px;

      .image-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--light-gray);
        width: 90px;
        height: 90px;

        img {
          width: 90%;
          height: auto;
        }
      }

      .item-info {
        display: flex;
        flex-direction: column;

        & > p {
          font-size: 16px;
        }

        .price {
          display: flex;
          align-items: center;
          justify-content: space-between;

          p {
            font-size: 14px;

            &:last-child {
              font-weight: 700;
            }
          }
        }
      }
    }
  }
}


</style>