<template>
  <div class="outer">
    <div class="input-wrapper">
      <label :for="inputId">{{ label }}</label>
      <input
          :class="{'userError': userError}"
          v-model="userInput"
          :type="computedInputType"
          :name="inputId"
          :id="inputId"
      >
      <div v-if="inputType == InputType.Password"
           @click="togglePassword"
           class="icon-wrapper">
        <img :src="getImage(showPassword ? 'ic_hide.png' : 'ic_show.png')" alt="">
      </div>
      <div v-if="inputType == InputType.Search"
           class="icon-wrapper">
        <img :src="getImage('ic_search.png')" alt="">
      </div>
    </div>
    <p :id="errorId" v-if="userError" class="error">{{ userError }}</p>
  </div>
</template>

<script setup lang="ts">

import {computed, type ModelRef, type Ref, ref, watch} from "vue";
import {InputType} from "@/models/InputType";
import {getImage} from "@/utils/ImageUtils";

const {label, inputType = InputType.Text} = defineProps<{
  label: string,
  inputType: InputType
}>()

const userInput: ModelRef<string | undefined> = defineModel('userInput')
const userError: ModelRef<string | undefined> = defineModel('userError')

const inputId = computed(() => `${label}-id`)
const errorId = computed(() => `${label}-error`)

const showPassword: Ref<boolean> = ref(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}

const computedInputType = computed(() => {
  if (inputType === InputType.PostalCode || InputType.Search) {
    return InputType.Text
  }
  return inputType === InputType.Password && showPassword.value ? InputType.Text : inputType
})

function validateMail(input: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(input);
}

function validatePhoneNumber(input: string): boolean {
  const regex = /^\+?[0-9]{1,4}[ -]?(\(?[0-9]{1,5}\)?[ -]?)?[0-9]{3,}[ -]?[0-9]{3,}$/
  return regex.test(input);
}

function onlyAllowDigits(input: string): string {
  return input.replace(/\D/g, '');
}


watch(userInput, newVal => {
  if (newVal) {
    userError.value = undefined
    let input = newVal.trim()
    switch (inputType) {
      case InputType.Text: {
        userError.value = input.length > 1 ? undefined : 'Bitte mehr als 1 Zeichen eingeben'
        break;
      }
      case InputType.Email: {
        userError.value = validateMail(input) ? undefined : 'Email ungültig'
        break;
      }
      case InputType.Phone: {
        userError.value = validatePhoneNumber(input) ? undefined : 'Telefonnummer ungültig'
        break;
      }
      case InputType.PostalCode: {
        input = onlyAllowDigits(input);
        userInput.value = input;
        break;
      }
    }
  } else {
    userError.value = undefined
  }
})


</script>

<style scoped>

.outer {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .input-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;

      img {
        width: 30px;
        height: 30px;
      }
    }

    input {
      margin: 0;
      height: 50px;
      outline: none;
      border: 1px solid var(--black);
      box-sizing: border-box;
      padding: 0 10px;
      border-radius: 4px;

      &.userError {
        border: 2px solid red;
      }

      &:focus {
        outline: 1px solid black;
      }
    }

    label {
      position: absolute;
      top: -8px;
      left: 8px;
      font-size: 14px;
      background-color: var(--white);
      box-sizing: border-box;
      padding: 0 5px;
    }
  }

  .error {
    font-size: 12px;
    color: red;
    display: flex;
    justify-content: flex-end;
  }
}


</style>