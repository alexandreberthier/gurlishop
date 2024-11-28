<template>
  <div class="route-wrapper">
    <DynamicInput
        label="Vorname"
        v-model:user-input="checkoutStore.personalData.firstName"
        v-model:user-error="firstNameError"
        :input-type="InputType.Text"
    />
    <DynamicInput
        label="Nachname"
        v-model:user-input="checkoutStore.personalData.lastName"
        v-model:user-error="lastNameError"
        :input-type="InputType.Text"
    />
    <DynamicInput
        label="Email"
        v-model:user-input="checkoutStore.personalData.email"
        v-model:user-error="emailError"
        :input-type="InputType.Email"
    />
    <DynamicInput
        label="Telefonnummer"
        v-model:user-input="checkoutStore.personalData.phoneNumber"
        v-model:user-error="phoneNumberError"
        :input-type="InputType.Phone"
    />
  </div>
</template>

<script setup lang="ts">

import DynamicInput from "@/components/DynamicInput.vue";

import {useCheckoutStore} from "@/stores/checkout";
import {nextTick, type Ref, ref} from "vue";
import {InputType} from "@/models/InputType";

const checkoutStore = useCheckoutStore()

const firstNameError: Ref<string> = ref('')
const lastNameError: Ref<string> = ref('')
const emailError: Ref<string> = ref('')
const phoneNumberError: Ref<string> = ref('')


function validateInputFields() {
  const fields = [
    {value: checkoutStore.personalData.firstName, error: firstNameError, label: 'Vorname'},
    {value: checkoutStore.personalData.lastName, error: lastNameError, label: 'Nachname'},
    {value: checkoutStore.personalData.email, error: emailError, label: 'Email'},
    {value: checkoutStore.personalData.phoneNumber, error: phoneNumberError, label: 'Telefonnummer'}
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