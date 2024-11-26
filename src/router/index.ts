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
            path: '/auth',
            name: 'auth',
            component: AuthLayout,
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
        }
    ],
    linkActiveClass: 'active',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        if (to.hash) {
            return { el: to.hash, behavior: 'smooth' };
        }
        return { x: 0, y: 0, behavior: 'smooth' };
    }
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const cartStore = useCartStore()

    if (to.meta.isLoggedIn && !authStore.isLoggedIn) {
        return next({ name: 'login' });
    }

    if(to.meta.hasItemsInCart && cartStore.totalCartItems < 1 ) {
        return next({ name: 'home' });
    }

    next();
});


export default router
