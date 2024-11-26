import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import { Item } from "@/models/Item";

export const useCartStore = defineStore('cart', () => {
    const showCartSlider: Ref<boolean> = ref(false);

    const savedCart = localStorage.getItem('cartItems');
    const itemsInCart: Ref<{ item: Item; quantity: number }[]> = ref(
        savedCart
            ? JSON.parse(savedCart).map((cartItem: any) => ({
                item: Item.fromDto(cartItem.item),
                quantity: cartItem.quantity
            }))
            : []
    );

    function addProduct(item: Item, quantity: number) {
        const existingItemIndex = itemsInCart.value.findIndex(cartItem => cartItem.item.id === item.id);

        if (existingItemIndex !== -1) {
            itemsInCart.value[existingItemIndex].quantity += quantity;
        } else {
            itemsInCart.value.push({
                item,
                quantity
            })
        }
    }

    function deleteProduct(item: Item) {
        const itemIndex = itemsInCart.value.findIndex(cartItem => cartItem.item.id === item.id);
        if (itemIndex !== -1) {
            itemsInCart.value.splice(itemIndex, 1);
        }
    }

    const totalCartItems = computed(() => {
        return itemsInCart.value.reduce((total, cartItem) => total + cartItem.quantity, 0);
    });

    const totalCartPrice = computed(() => {
        return itemsInCart.value.reduce((total, cartItem) => {
            return total + cartItem.item.price * cartItem.quantity;
        }, 0)
    })

    const deliveryCosts: Ref<number> = ref(7.90);

    const totalCartPriceWithDeliveryCosts = computed(() => {
        return totalCartPrice.value + deliveryCosts.value;
    })

    function toggleCartSlider() {
        showCartSlider.value = !showCartSlider.value;
    }

    function hideCartSlider() {
        showCartSlider.value = false;
    }

    watch(itemsInCart, (newCart) => {
        showCartSlider.value = newCart.length !== 0;

        localStorage.setItem(
            'cartItems',
            JSON.stringify(
                newCart.map(cartItem => ({
                    item: cartItem.item.toDto(),
                    quantity: cartItem.quantity
                }))
            )
        );
    }, { deep: true });

    function clearCartData() {
        localStorage.removeItem('cartItems');
        itemsInCart.value = [];
    }

    return {
        showCartSlider,
        toggleCartSlider,
        hideCartSlider,
        addProduct,
        deleteProduct,
        totalCartItems,
        totalCartPrice,
        totalCartPriceWithDeliveryCosts,
        itemsInCart,
        deliveryCosts,
        clearCartData
    }
})
