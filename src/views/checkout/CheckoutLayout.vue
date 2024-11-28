<template>
  <StaticLayout>
    <div class="step-flex">
      <div
          v-for="(step, index) in checkoutStore.checkoutSteps"
          :key="index"
          @click="goToStep(index)"
          class="step"
          :class="{'active': index === currentStepIndex, 'completed': index < currentStepIndex }">
        <p>{{ step.heading }}</p>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <component v-if="Component" ref="comp" :is="Component"></component>
    </router-view>
    <div class="button-section">
      <DynamicButton
          :button-type="ButtonType.Primary"
          @click="validate"
          text="Weiter"/>
      <DynamicButton
          @click="goBack"
          :button-type="ButtonType.Secondary"
          text="Zurück"/>
    </div>
  </StaticLayout>
</template>


<script setup lang="ts">
import StaticLayout from "@/views/layout/StaticLayout.vue";
import {type Ref, ref, computed} from "vue";
import DynamicButton from "@/components/DynamicButton.vue";
import {ButtonType} from "@/models/ButtonType";
import {useCheckoutStore} from "@/stores/checkout";
import {useRoute, useRouter} from "vue-router";

const checkoutStore = useCheckoutStore();
const router = useRouter();
const route = useRoute();

interface ValidationComponent {
  validateInputFields: () => boolean;
}

const comp: Ref<ValidationComponent | null> = ref(null);

const currentStepIndex = computed(() =>
    checkoutStore.checkoutSteps.findIndex(step => step.pathName === route.name)
)

function goToStep(index: number) {
  if (index < 0 || index >= checkoutStore.checkoutSteps.length) {
    console.error("Ungültiger Schritt-Index:", index);
    return;
  }

  if (checkoutStore.checkoutSteps[index].isValidated || index <= currentStepIndex.value) {
    router.push({ name: checkoutStore.checkoutSteps[index].pathName });
  } else {
    console.warn("Der gewählte Schritt ist nicht validiert. Navigation blockiert.");
  }
}


function validate() {
  if (comp.value) {
    const isValid = comp.value?.validateInputFields();
    if (!isValid) return;

    const stepIndex = currentStepIndex.value;

    if (stepIndex !== -1) {
      checkoutStore.checkoutSteps[stepIndex].isValidated = true;
    }

    if (stepIndex >= 0 && stepIndex < checkoutStore.checkoutSteps.length - 1) {
      router.push({ name: checkoutStore.checkoutSteps[stepIndex + 1].pathName });
    }
  }
}


function goBack() {
  const stepIndex = currentStepIndex.value;

  if(stepIndex !== 1 && stepIndex === 0){
    router.push({name: 'cart'})
  }

  if (stepIndex !== -1 && stepIndex > 0) {
    router.push({name: checkoutStore.checkoutSteps[stepIndex - 1].pathName});
  }
}
</script>


<style scoped>

.step-flex {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  .step {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-bottom: 3px solid transparent; /* Standardzustand */
    position: relative;
    transition: border-color 0.3s;
    cursor: pointer;

    &.active {
      border-bottom: 3px solid blue; /* Aktiver Schritt */
    }

    &.completed {
      border-bottom: 3px solid green; /* Abgeschlossener Schritt */
    }

    p {
      font-size: 12px;
    }
  }
}

.button-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>