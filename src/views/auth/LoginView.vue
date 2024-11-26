<template>
  <div class="form">
    <h1>Login</h1>
    <div class="sub-heading">
      <p>Noch keinen Account?</p>
      <router-link :to="{name: 'register'}">Registrieren!</router-link>
    </div>
    <DynamicInput
        label="Email"
        :input-type="InputType.Email"
        v-model:user-input="email"
        v-model:user-error="emailError"
    />
    <DynamicInput
        label="Password"
        :input-type="InputType.Password"
        v-model:user-input="password"
        v-model:user-error="passwordError"
    />
    <DynamicButton
        text="Login"
        :is-loading="authStore.isLoading"
        @click="login"
    />
  </div>
</template>

<script setup lang="ts">
import DynamicInput from "@/components/DynamicInput.vue";
import {nextTick, type Ref, ref} from "vue";
import {InputType} from "@/models/InputType";
import DynamicButton from "@/components/DynamicButton.vue";
import {useAuthStore} from "@/stores/auth";

const authStore = useAuthStore()

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')

const emailError: Ref<string> = ref('')
const passwordError: Ref<string> = ref('')

function login() {
  if (!validateInputFields()) return

  authStore.login(email.value, password.value)
}

function validateInputFields() {
  const fields = [
    {value: email.value, error: emailError},
    {value: password.value, error: passwordError}
  ]

  let errorHTML: HTMLElement | null = null

  fields.forEach(field => {
    if (!field.value) {
      field.error.value = 'Bitte noch ausfüllen'
      if (field.error && !errorHTML) {
        errorHTML = document.querySelector('.error')
      }
    }
  })

  if (errorHTML) {
    nextTick(() => {
      errorHTML?.scrollIntoView({behavior: 'smooth', block: 'center'})
    })
  }

  return fields.every(field => !field.error.value)
}

defineExpose({validateInputFields})


</script>

<style scoped>

.form {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 420px;

  .sub-heading {
    display: flex;
    align-items: center;
    gap: 4px;

    p, a {
      font-size: 16px;
    }

    a {
      text-decoration: underline;
    }
  }
}


</style>