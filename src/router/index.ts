import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthLayout from "@/views/auth/AuthLayout.vue";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import ContactView from "@/views/ContactView.vue";
import FaqView from "@/views/FaqView.vue";
import CartView from "@/views/CartView.vue";
import UserLayout from "@/views/user/UserLayout.vue";
import UserDataView from "@/views/user/UserDataView.vue";
import UserOrderView from "@/views/user/UserOrderView.vue";
import {useAuthStore} from "@/stores/auth";
import DetailsView from "@/views/DetailsView.vue";
import {useCartStore} from "@/stores/cartStore";
import CheckoutLayout from "@/views/checkout/CheckoutLayout.vue";
import PersonalData from "@/views/checkout/PersonalData.vue";
import DeliveryData from "@/views/checkout/DeliveryData.vue";
import Payment from "@/views/checkout/Payment.vue";
import ConfirmOrder from "@/views/checkout/ConfirmOrder.vue";
import ImprintView from "@/views/ImprintView.vue";
import AdminView from "@/views/admin/AdminView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/kontakt',
            name: 'contact',
            component: ContactView
        },
        {
            path: '/faq',
            name: 'faq',
            component: FaqView,
        },
        {
            path: '/details/:id',
            name: 'details',
            component: DetailsView,
            props: true
        },
        {
            path: '/warenkorb',
            name: 'cart',
            component: CartView,
            meta: {hasItemsInCart: true}
        },
        {
            path: '/impressum',
            name: 'imprint',
            component: ImprintView,
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminView,
            meta: {isLoggedIn: true, isAdmin: true},
        },
        {
            path: '/auth',
            name: 'auth',
            component: AuthLayout,
            meta: {isLoggedIn: false},
            redirect: {name: 'login'},
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: LoginView,
                },
                {
                    path: 'registrieren',
                    name: 'register',
                    component: RegisterView
                },
            ]
        },
        {
            path: '/user',
            name: 'user',
            component: UserLayout,
            meta: {isLoggedIn: true},
            redirect: {name: 'user-data'},
            children: [
                {
                    path: 'daten',
                    name: 'user-data',
                    component: UserDataView
                },
                {
                    path: 'bestellungen',
                    name: 'user-orders',
                    component: UserOrderView
                }
            ]
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: CheckoutLayout,
            redirect: {name: 'personal-data'},
            meta: {hasItemsInCart: true},
            children: [
                {
                    path: 'persoenliche-daten',
                    name: 'personal-data',
                    component: PersonalData
                },
                {
                    path: 'lieferadresse',
                    name: 'delivery-data',
                    component: DeliveryData
                },
                {
                    path: 'zahlung',
                    name: 'payment',
                    component: Payment
                },
                {
                    path: 'bestellbestaetigung',
                    name: 'confirm-order',
                    component: ConfirmOrder
                },
            ]
        }
    ],
    linkActiveClass: 'active',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        if (to.hash) {
            return {el: to.hash, behavior: 'smooth'};
        }
        return {x: 0, y: 0, behavior: 'smooth'};
    }
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const cartStore = useCartStore();


    if (to.meta.isLoggedIn === false && authStore.isLoggedIn) {
        return next({ name: 'home' }); // Umleitung auf die Startseite oder eine andere geeignete Seite
    }

    // Schutz für Admin-Routen
    if (to.meta.isAdmin && (!authStore.isLoggedIn || !authStore.isAdmin)) {
        return next({ name: 'login' });
    }


    // Schutz für eingeloggte Benutzer
    if (to.meta.isLoggedIn && !authStore.isLoggedIn) {
        return next({ name: 'login' });
    }

    // Schutz für Warenkorb-Routen
    if (to.meta.hasItemsInCart && cartStore.totalCartItems < 1) {
        return next({ name: 'home' });
    }

    next();
});





export default router
