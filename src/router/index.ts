import {createRouter,createWebHistory} from 'vue-router';

import Home from '../pages/Home.vue'
import Page1 from '../pages/Page1.vue'
import Page2 from '../pages/Page2.vue'

import FloorMapRoutes from "./floor-map"

const routes = [
    {
        path: "/",
        component:Home,
    },
    { path: '/page1', component: Page1 },
    { path: '/page2', component: Page2 },
    ...FloorMapRoutes
]

export default createRouter({
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})
