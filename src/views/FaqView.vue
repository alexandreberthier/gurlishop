<template>
  <StaticLayout
      header="FAQ"
      sub-header="Die Antworten, die du suchst!"
  >
    <div class="faq-wrapper">
      <DynamicInput
          label="Suche"
          :input-type="InputType.Search"
          v-model="searchInput"
      />
      <AccordionItem
          v-for="(faq, index) in faqs"
          :key="index"
          :accordion-content="faq"
          :is-open="isItemOpen(index, faq)"
          @toggleContent="toggleContent(index)"
      />
    </div>
  </StaticLayout>
</template>

<script setup lang="ts">

import StaticLayout from "@/views/layout/StaticLayout.vue";
import DynamicInput from "@/components/DynamicInput.vue";
import { InputType } from "@/models/InputType";
import { ref } from "vue";
import AccordionItem from "@/components/AccordionItem.vue";
import type { AccordionItemContent } from "@/models/PropInterfaces";

const searchInput = ref<string>('');
const activeIndex = ref<number | null>(null);

const faqs = ref<AccordionItemContent[]>([
  {
    header: "Wie kann ich eine Buchung stornieren?",
    content: "Sie können Ihre Buchung bis zu 24 Stunden vor dem Termin kostenlos stornieren, indem Sie uns per E-Mail kontaktieren oder das Stornierungsformular auf unserer Website ausfüllen."
  },
  {
    header: "Bieten Sie auch individuelle Anpassungen an?",
    content: "Ja, wir passen unsere Dienstleistungen individuell an Ihre Wünsche und Bedürfnisse an. Kontaktieren Sie uns einfach für ein unverbindliches Beratungsgespräch."
  },
  {
    header: "Gibt es zusätzliche Kosten für längere Veranstaltungen?",
    content: "Ab einer Dauer von vier Stunden können zusätzliche Kosten anfallen. Diese werden jedoch transparent im Voraus mit Ihnen besprochen."
  },
  {
    header: "Wie lange im Voraus sollte ich buchen?",
    content: "Wir empfehlen, mindestens vier Wochen im Voraus zu buchen, um sicherzustellen, dass Ihr Wunschtermin verfügbar ist."
  },
  {
    header: "Kann ich kurzfristig Änderungen vornehmen?",
    content: "Ja, kleine Änderungen können Sie bis zu 48 Stunden vor dem Event mitteilen. Größere Änderungen sollten frühzeitig besprochen werden."
  },
  {
    header: "Welche Zahlungsmethoden akzeptieren Sie?",
    content: "Wir akzeptieren Banküberweisungen, PayPal und Kreditkartenzahlungen. Barzahlungen sind nur nach Absprache möglich."
  },
  {
    header: "Ist eine persönliche Beratung im Preis enthalten?",
    content: "Ja, eine persönliche Beratung ist in unseren Angeboten inklusive. Dies hilft uns, Ihre Wünsche besser zu verstehen und umzusetzen."
  },
  {
    header: "Können Sie auch zweisprachige Events moderieren?",
    content: "Ja, wir bieten zweisprachige Moderation in Deutsch und Englisch an. Bitte informieren Sie uns im Voraus, wenn Sie dies wünschen."
  },
  {
    header: "Gibt es eine Mindestdauer für Veranstaltungen?",
    content: "Die Mindestdauer für unsere Dienstleistungen beträgt eine Stunde. Für kürzere Veranstaltungen können Sie uns gerne individuell anfragen."
  },
  {
    header: "Was passiert, wenn ein Event abgesagt wird?",
    content: "Bei einer Absage gelten unsere Stornierungsbedingungen. Diese finden Sie in unseren AGB auf der Website."
  }
]);

function toggleContent(index: number) {
  activeIndex.value = activeIndex.value === index ? null : index;
}

function isItemOpen(index: number, faq: AccordionItemContent) {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (!searchTerm) {
    return activeIndex.value === index;
  }
  return faq.content.toLowerCase().includes(searchTerm) ||
      faq.header.toLowerCase().includes(searchTerm);
}

</script>


<style scoped>

.faq-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

</style>