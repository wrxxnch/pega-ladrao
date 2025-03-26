import { createRouter, createWebHistory } from 'vue-router'

import NotFound from './views/NotFound.vue';
import GerarView from './views/GerarView.vue'
import ComprovanteFakeView from './views/ComprovanteFakeView.vue';

const routes = [
    // will match everything and put it under `route.params.pathMatch`
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    { path: '/_gerar', component: GerarView },
    { path: '/transacao', component: ComprovanteFakeView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;