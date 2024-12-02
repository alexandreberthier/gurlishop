<template>
  <StaticLayout
      header="Kontakt"
      sub-header="Dir liegt was am Herzen? Frag uns!"
  >
    <div class="contact-flex">
      <a
          class="contact-option"
          href="mailto:gurli@gurlinga.at">
        <div class="icon-wrapper">
          <img :src="getImage('ic_email.png')" alt="">
        </div>
        <p>gurli@gurlinga.at</p>
      </a>
      <a
          class="contact-option"
          href="tel:+43676123456">
        <div class="icon-wrapper">
          <img :src="getImage('ic_phone.png')" alt="">
        </div>
        <p>+43 676 123456</p>
      </a>
    </div>

    <div class="form-wrapper">
      <div class="row">
        <DynamicInput
            v-model:user-input="firstName"
            v-model:user-error="firstNameError"
            :input-type="InputType.Text"
            label="Vorname"
        />
        <DynamicInput
            v-model:user-input="lastName"
            v-model:user-error="lastNameError"
            :input-type="InputType.Text"
            label="Nachname"
        />
      </div>
      <div class="row">
        <DynamicInput
            v-model:user-input="email"
            v-model:user-error="emailError"
            :input-type="InputType.Email"
            label="Email"
        />
        <DynamicInput
            v-model:user-input="phoneNumber"
            v-model:user-error="phoneNumberError"
            :input-type="InputType.Phone"
            label="Telefonnummer"
        />
      </div>
      <div class="text-area-wrapper">
        <label for="message">Deine Nachricht</label>
        <textarea v-model="message" name="" id="message" cols="30" rows="10"></textarea>
        <p class="error">{{messageError}}</p>
      </div>
      <DynamicButton
          @click="sendContactForm"
          text="Senden"/>
    </div>
  </StaticLayout>

</template>

<script setup lang="ts">

import StaticLayout from "@/views/layout/StaticLayout.vue";
import {nextTick, type Ref, ref} from "vue";
import {getImage} from "@/utils/ImageUtils";
import DynamicInput from "@/components/DynamicInput.vue";
import {InputType} from "@/models/InputType";
import DynamicButton from "@/components/DynamicButton.vue";

const firstName: Ref<string> = ref('')
const lastName: Ref<string> = ref('')
const email: Ref<string> = ref('')
const phoneNumber: Ref<string> = ref('')
const message: Ref<string> = ref('')

const firstNameError: Ref<string> = ref('')
const lastNameError: Ref<string> = ref('')
const emailError: Ref<string> = ref('')
const phoneNumberError: Ref<string> = ref('')
const messageError: Ref<string> = ref('')

function sendContactForm() {
  const fields = [
    {value: firstName.value, error: firstNameError, label: 'Vorname'},
    {value: lastName.value, error: lastNameError, label: 'Nachname'},
    {value: emailError.value, error: emailError, label: 'Email'},
    {value: message.value, error: messageError, label: 'Nachricht'},
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


</script>

<style scoped>

.contact-flex {
  display: flex;
  flex-direction: column;
  gap: 32px;

  .contact-option {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 30px;
        height: 30px;
      }
    }
  }
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .row {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .text-area-wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 4px;

    label {
      position: absolute;
      top: -8px;
      left: 8px;
      font-size: 14px;
      background-color: var(--white);
      box-sizing: border-box;
      padding: 0 5px;
    }

    textarea {
      border: 1px solid var(--black);
      border-radius: 4px;
      outline: none;
      box-sizing: border-box;
      padding: 20px 10px;
      font-size: 18px;

      &:focus {
        outline: 1px solid black;
      }
    }

    .error {
      color: red;
      font-size: 12px;
      text-align: right;
    }
  }

  .button {
    width: 100%;
    max-width: 280px;
    align-self: center;
  }
}

@media (min-width: 740px) {
  .contact-flex {
    flex-direction: row;

    .contact-option {
      gap: 16px;
    }
  }

  .form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .row {
      display: flex;
      flex-direction: row;
      gap: 16px;
    }

    .text-area-wrapper {
      display: flex;
      flex-direction: column;
      position: relative;

      label {
        position: absolute;
        top: -8px;
        left: 8px;
        font-size: 14px;
        background-color: var(--white);
        box-sizing: border-box;
        padding: 0 5px;
      }

      textarea {
        border: 1px solid var(--black);
        border-radius: 4px;
        outline: none;
        box-sizing: border-box;
        padding: 20px 10px;
        font-size: 18px;

        &:focus {
          outline: 1px solid black;
        }
      }
    }
  }
}

@media (min-width: 1200px) {
  .contact-flex {
    flex-direction: row;

    .contact-option {
      gap: 16px;
    }
  }

  .form-wrapper {
    gap: 32px;

    .row {
      > * {
        width: 400px
      }
    }

  }
}


</style>