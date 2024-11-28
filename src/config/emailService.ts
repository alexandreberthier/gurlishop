import emailjs from "@emailjs/browser";


const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


export function sendConfirmationEmail(params: {
    transactionId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    products: string;
    totalAmount: string;
}) {
    return emailjs
        .send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY)
        .then((response) => {
            console.log("E-Mail erfolgreich gesendet:", response);
            return response; // Erfolgreiche Antwort zurückgeben
        })
        .catch((error) => {
            console.error("Fehler beim Senden der E-Mail:", error);
            throw error; // Fehler weitergeben, falls benötigt
        });
}

