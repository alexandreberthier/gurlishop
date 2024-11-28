<template>
  <div class="route-wrapper">
    <DynamicInput
        label="Straße"
        v-model:user-input="checkoutStore.deliveryData.street"
        v-model:user-error="streetError"
        :input-type="InputType.Text"
    />
    <DynamicInput
        label="Hausnummer"
        v-model:user-input="checkoutStore.deliveryData.houseNumber"
        v-model:user-error="houseNumberError"
        :input-type="InputType.Text"
    />
    <DynamicInput
        label="Postleitzahl"
        v-model:user-input="checkoutStore.deliveryData.postalCode"
        v-model:user-error="postalCodeError"
        :input-type="InputType.PostalCode"
    />
    <DynamicInput
        label="Stadt"
        v-model:user-input="checkoutStore.deliveryData.city"
        v-model:user-error="cityError"
        :input-type="InputType.Text"
    />
    <DynamicInput
        label="Land"
        v-model:user-input="checkoutStore.deliveryData.country"
        v-model:user-error="countryError"
        :input-type="InputType.Text"
    />
  </div>
</template>

<script setup lang="ts">

import DynamicInput from "@/components/DynamicInput.vue";

import {useCheckoutStore} from "@/stores/checkout";
import {nextTick, type Ref, ref} from "vue";
import {InputType} from "@/models/InputType";

const checkoutStore = useCheckoutStore()

const streetError: Ref<string> = ref('')
const houseNumberError: Ref<string> = ref('')
const postalCodeError: Ref<string> = ref('')
const cityError: Ref<string> = ref('')
const countryError: Ref<string> = ref('')


function validateInputFields() {
  const fields = [
    {value: checkoutStore.deliveryData.street, error: streetError, label: 'Straße'},
    {value: checkoutStore.deliveryData.houseNumber, error: houseNumberError, label: 'Hausnummer'},
    {value: checkoutStore.deliveryData.postalCode, error: postalCodeError, label: 'Postleitzahl'},
    {value: checkoutStore.deliveryData.city, error: cityError, label: 'Stadt'},
    {value: checkoutStore.deliveryData.country, error: countryError, label: 'Land'}
  ]

  let errorHTML: HTMLElement | null = null

  fields.forEach(field => {
    if (!field.value) {
      field.error.value = `Bitte ${field.label} ausfüllen`
      if (field.error.value && !errorHTML) {
        errorHTML = document.querySelector('.error')
      }
    }
  })

  if (errorHTML) {
    nextTick(() => {
      errorHTML?.scrollIntoView({behavior: "smooth", block: 'center'})
    })
  }

  return fields.every(field => !field.error.value)
}

defineExpose({validateInputFields})
</script>

<style scoped>

.route-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

</style>