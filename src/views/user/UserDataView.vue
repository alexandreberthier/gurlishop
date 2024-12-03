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
});

const successMessage = ref(authStore.successMessage);
const errorMessage = ref(authStore.errorMessage);

function initializeData() {
  if (authStore.user) {
    personalData.value = {
      ...authStore.user.personalData,
      email: authStore.user.personalData?.email || ''
    };
    deliveryData.value = {
      ...authStore.user.deliveryData
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
    personalData: {
      ...personalData.value,
      email: ''
    },
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
