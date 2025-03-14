<template>
    <div class="mb-3 text-center">
        <img :src="imgSrc" class="img-fluid" style="max-width: 75%;">
    </div>
</template>

<script setup>
import { computed } from 'vue';

const randomNum = Math.floor(Math.random() * 17) + 1;

const imgSrc = computed(() => {
    return new URL(`../assets/ads/${randomNum}.png`, import.meta.url).href
});
</script>