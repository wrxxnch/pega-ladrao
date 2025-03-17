<template>
    <div class="mb-3 text-center">
        <img :src="imgSrc" class="img-fluid ads">
    </div>
</template>

<script setup>
import { computed } from 'vue';

const randomNum = Math.floor(Math.random() * 23) + 1;

const imgSrc = computed(() => {
    return new URL(`../assets/ads/${randomNum}.png`, import.meta.url).href
});
</script>

<style scoped>
.ads {
    max-width: 75%;
    border: 1px solid black
}
</style>