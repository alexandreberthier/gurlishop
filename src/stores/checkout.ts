import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { Ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { PersonalData, DeliveryData } from "@/models/User";

export const useCheckoutStore = defineStore("checkout", () => {
    const authStore = useAuthStore();



    const checkoutSteps = ref([
        {heading: 'Persönliche Daten', pathName: 'personal-data', isValidated: false},
        {heading: 'Lieferadresse', pathName: 'delivery-data', isValidated: false},
        {heading: 'Zahlung', pathName: 'payment', isValidated: false},
        {heading: 'Bestätigung', pathName: 'confirm-order', isValidated: false},
    ])


    // Persönliche Daten
    const personalData: Ref<PersonalData> = ref({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });

    // Lieferdaten
    const deliveryData: Ref<DeliveryData> = ref({
        street: "",
        houseNumber: "",
        postalCode: "",
        city: "",
        country: "",
    });

    // Automatisches Laden der Daten aus dem `localStorage` beim Erstellen des Stores
    const loadStoredData = () => {
        const savedPersonalData = localStorage.getItem("checkoutPersonalData");
        const savedDeliveryData = localStorage.getItem("checkoutDeliveryData");

        if (savedPersonalData) {
            personalData.value = JSON.parse(savedPersonalData);
        }

        if (savedDeliveryData) {
            deliveryData.value = JSON.parse(savedDeliveryData);
        }
    };

    loadStoredData();

    watch(
        () => authStore.user,
        (newUser) => {
            if (newUser?.personalData) {
                personalData.value = { ...personalData.value, ...newUser.personalData };
            }
            if (newUser?.deliveryData) {
                deliveryData.value = { ...deliveryData.value, ...newUser.deliveryData };
            }
        },
        { immediate: true, deep: true }
    );

    // Beobachte Änderungen in `personalData` und speichere sie im `localStorage`
    watch(
        personalData,
        (newPersonalData) => {
            localStorage.setItem("checkoutPersonalData", JSON.stringify(newPersonalData));
        },
        { deep: true }
    );

    // Beobachte Änderungen in `deliveryData` und speichere sie im `localStorage`
    watch(
        deliveryData,
        (newDeliveryData) => {
            localStorage.setItem("checkoutDeliveryData", JSON.stringify(newDeliveryData));
        },
        { deep: true }
    );

    // Daten zurücksetzen und aus dem `localStorage` entfernen
    function clearCheckoutData() {
        localStorage.removeItem("checkoutPersonalData");
        localStorage.removeItem("checkoutDeliveryData");
        personalData.value = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
        };
        deliveryData.value = {
            street: "",
            houseNumber: "",
            postalCode: "",
            city: "",
            country: "",
        };
    }

    return {
        personalData,
        deliveryData,
        checkoutSteps,
        clearCheckoutData,
    };
});
