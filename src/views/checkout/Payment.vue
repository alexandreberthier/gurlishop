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
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup lang="ts">
import {useCheckoutStore} from "@/stores/checkout";
import {useCartStore} from "@/stores/cartStore";
import {computed, onMounted, watch} from "vue";
import {getImage} from "@/utils/ImageUtils";
import {formatPrice} from "@/utils/PriceUtils";
import {sendConfirmationEmail} from "@/config/emailService";
import {useRoute, useRouter} from "vue-router";

interface PayPalData {
  orderID: string;
}

interface PayPalActions {
  order: {
    create: (details: object) => Promise<string>;
    capture: () => Promise<any>;
  };
}

declare global {
  interface Window {
    paypal: any;
  }
}


const router = useRouter()
const route = useRoute()

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

const currentStepIndex = computed(()=> {
  return checkoutStore.checkoutSteps.findIndex(step => step.pathName === route.name)
})


const totalPriceWithDeliveryCosts = computed(()=> {
  return cartStore.totalCartPriceWithDeliveryCosts
})

function loadPayPalSDK() {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID; // Client-ID aus .env
  const currency = "EUR"; // Standard-Währung
  if (!clientId) {
    console.error("PayPal-Client-ID fehlt. Bitte .env prüfen.");
    return;
  }

  if (!document.querySelector(`script[src*="paypal.com/sdk/js"]`)) {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.async = true;
    script.onload = () => initializePayPalButtons();
    script.onerror = () =>
        console.error("Fehler beim Laden des PayPal-SDK-Skripts.");
    document.head.appendChild(script);
  } else {
    initializePayPalButtons();
  }
}

// PayPal-Buttons initialisieren
function initializePayPalButtons() {
  if (window.paypal) {
    window.paypal
        .Buttons({
          createOrder: (data: PayPalData, actions: PayPalActions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalPriceWithDeliveryCosts.value.toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: (data: PayPalData, actions: PayPalActions) => {
            return actions.order.capture().then((details) => {
              console.log("Zahlung abgeschlossen:", details);
              const stepIndex = currentStepIndex.value;

              if (stepIndex !== -1 && checkoutStore.checkoutSteps[stepIndex]) {
                checkoutStore.checkoutSteps[stepIndex].isValidated = true;
              } else {
                console.error(
                    "Ungültiger Schritt oder fehlender Schritt:",
                    stepIndex
                );
              }

              const emailParams = {
                transactionId: details.id,
                firstName: personalData.value?.firstName ?? "",
                lastName: personalData.value?.lastName ?? "",
                email: personalData.value?.email ?? "",
                phoneNumber: personalData.value?.phoneNumber ?? "",
                products: cartItems.value
                    .map(
                        (item) =>
                            `- ${item.item.displayName}: ${item.quantity}x ${formatPrice(
                                item.item.price
                            )}`
                    )
                    .join("\n"),
                totalAmount: totalPriceWithDeliveryCosts.value.toFixed(2),
              };

              sendConfirmationEmail(emailParams)
                  .then((response) => {
                    console.log("E-Mail-Response:", response);
                  })
                  .catch((error) => {
                    console.error("Fehler beim Senden der E-Mail:", error);
                  });

              router.push({ name: "confirm-order" });
            });
          },
          onError: (err: any) => {
            console.error("PayPal-Fehler:", err);
            alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
          },
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
          },
          commit: true,
        })
        .render("#paypal-button-container");
  } else {
    console.error("PayPal-SDK wurde nicht geladen.");
  }
}

onMounted(() => loadPayPalSDK());




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