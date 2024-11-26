import {defineStore} from "pinia";
import { ref} from "vue";
import type { Ref} from "vue";
import type {ItemDto} from "@/models/Item";
import {Category} from "@/models/Item";


export const useProductStore = defineStore('product', ()=> {


    const items: Ref<ItemDto[]> = ref([
        {
            id: "1",
            displayName: "Kuscheldecke Classic",
            desc: "Eine weiche und gemütliche Decke aus hochwertigem Material.",
            price: 29.99,
            category: Category.Blankets,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "2",
            displayName: "Strickdecke Winter",
            desc: "Perfekt für kalte Winterabende, aus 100% Wolle.",
            price: 49.99,
            category: Category.Blankets,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "3",
            displayName: "Reisedecke Kompakt",
            desc: "Leicht und kompakt, ideal für unterwegs.",
            price: 19.99,
            category: Category.Blankets,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "4",
            displayName: "Stylische Tasche",
            desc: "Eine vielseitige und robuste Tasche für den Alltag.",
            price: 39.99,
            category: Category.Bags,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "5",
            displayName: "Elegante Handtasche",
            desc: "Eine elegante Handtasche für besondere Anlässe.",
            price: 89.99,
            category: Category.Bags,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "6",
            displayName: "Laptop-Tasche Pro",
            desc: "Eine praktische Tasche mit Fächern für Laptops und Zubehör.",
            price: 59.99,
            category: Category.Bags,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "7",
            displayName: "Große Tragetasche",
            desc: "Robust und geräumig, perfekt für Einkäufe.",
            price: 24.99,
            category: Category.Bags,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "8",
            displayName: "Wollsocken Premium",
            desc: "Bequeme und warme Wollsocken für den Winter.",
            price: 19.99,
            category: Category.Socks,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "9",
            displayName: "Sportsocken Ultra",
            desc: "Atmungsaktive Sportsocken für intensive Workouts.",
            price: 12.99,
            category: Category.Socks,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "10",
            displayName: "Wandersocken Explorer",
            desc: "Extra gepolsterte Socken für lange Wanderungen.",
            price: 14.99,
            category: Category.Socks,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "11",
            displayName: "Kompressionssocken Active",
            desc: "Fördert die Durchblutung bei langen Flügen oder Workouts.",
            price: 22.99,
            category: Category.Socks,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "12",
            displayName: "Sommerdecke Light",
            desc: "Angenehm leicht und perfekt für warme Nächte.",
            price: 34.99,
            category: Category.Blankets,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
        {
            id: "13",
            displayName: "Decke mit Muster",
            desc: "Stylische Decke mit modernem Design.",
            price: 44.99,
            category: Category.Blankets,
            images: ["img_bag_1.png", "img_bag_2.png", "img_bag_3.png"]
        },
    ])

    return {
        items
    }
})