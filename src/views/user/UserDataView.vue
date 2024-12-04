<template>
  <div class="wrapper">
    <div class="section">
      <h2>Persönliche Daten</h2>
      <DynamicInput
          label="Vorname"
          :input-type="InputType.Text"
          v-model:user-input="personalData.firstName"
      />
      <DynamicInput
          label="Nachname"
          :input-type="InputType.Text"
          v-model:user-input="personalData.lastName"
      />
      <!-- E-Mail-Adresse nur anzeigen -->
      <p><strong>Email:</strong> {{ personalData.email }}</p>
      <DynamicInput
          label="Telefonnummer"
          :input-type="InputType.Phone"
          v-model:user-input="personalData.phoneNumber"
      />
    </div>

    <div class="section">
      <h2>Lieferadresse</h2>
      <DynamicInput
          label="Straße"
          :input-type="InputType.Text"
          v-model:user-input="deliveryData.street"
      />
      <DynamicInput
          label="Hausnummer"
          :input-type="InputType.Text"
          v-model:user-input="deliveryData.houseNumber"
      />
      <DynamicInput
          label="PLZ"
          :input-type="InputType.Text"
          v-model:user-input="deliveryData.postalCode"
      />
      <DynamicInput
          label="Stadt"
          :input-type="InputType.Text"
          v-model:user-input="deliveryData.city"
      />
      <DynamicInput
          label="Land"
          :input-type="InputType.Text"
          v-model:user-input="deliveryData.country"
      />
    </div>

    <DynamicButton
        @click="saveData"
        text="Speichern"
    />
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useAuthStore} from "@/stores/auth";
import DynamicInput from "@/components/DynamicInput.vue";
import {InputType} from "@/models/InputType";
import DynamicButton from "@/components/DynamicButton.vue";
import type {DeliveryData, PersonalData} from "@/models/User";

const authStore = useAuthStore();

const personalData = ref<Partial<PersonalData>>({
  firstName: '',
  lastName: '',
  email: undefined, // Typ als optional definieren
  phoneNumber: ''
});

const deliveryData = ref<Partial<DeliveryData>>({
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  country: ''
})


function initializeData() {
  if (authStore.user) {
    personalData.value = {
      firstName: authStore.user.personalData?.firstName || '',
      lastName: authStore.user.personalData?.lastName || '',
      email: authStore.user.personalData?.email || '',
      phoneNumber: authStore.user.personalData?.phoneNumber || ''
    };
    deliveryData.value = {
      street: authStore.user.deliveryData?.street || '',
      houseNumber: authStore.user.deliveryData?.houseNumber || '',
      postalCode: authStore.user.deliveryData?.postalCode || '',
      city: authStore.user.deliveryData?.city || '',
      country: authStore.user.deliveryData?.country || ''
    };
  }
}


// Überwache Änderungen im Benutzerobjekt
watch(
    () => authStore.user,
    () => {
      initializeData();
    },
    {immediate: true}
);

onMounted(() => {
  initializeData();
});


function saveData() {
  authStore.updateUserInfo({
    personalData: personalData.value,
    deliveryData: deliveryData.value,
  });
}

</script>


<style scoped>

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 64px;
  width: 100%;

  .section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

</style>
