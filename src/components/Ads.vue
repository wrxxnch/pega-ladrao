<template>
    <div class="mb-3 text-center">
        <a :href="data.urls[data.randomNum - 1]" target="_blank" rel="noopener noreferrer">
            <img :src="imgSrc" class="img-fluid ads">
        </a>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

const data = reactive({
    urls: [
        'https://cassino.bet.br/',
        'https://www.canva.com/pt_br/',
        'https://www.bemol.com.br/',
        'https://www.instagram.com/bis',
        'https://www.instagram.com/bis',
        'https://www.coca-cola.com/br/pt',
        'https://usefathom.com/',
        'https://www.bemol.com.br/',
        'https://www.vw.com.br/pt.html',
        'https://www.pravaler.com.br/',
        'https://www.instagram.com/oreo_brasil/',
        'https://cassino.bet.br/',
        'https://www.instagram.com/bis',
        'https://www.instagram.com/oreo_brasil/',
        'https://www.cruzeirodosul.edu.br/',
        'https://www.canva.com/pt_br/',
        'https://www.instagram.com/trident_brasil/',
        'https://cassino.bet.br/',
        'https://www.hoteis.com/',
        'https://www.cloudtalk.io/pt-br/',
        'https://darklabsuplementos.com.br/',
        'https://www.texaco.com.br/',
        'https://www.canva.com/pt_br/',
    ],
    randomNum: Math.floor(Math.random() * 23) + 1
});

const imgSrc = computed(() => {
    return new URL(`../assets/ads/${data.randomNum}.png`, import.meta.url).href
});
</script>

<style scoped>
.ads {
    /* max-width: 75%; */
    border: 1px solid black
}
</style>