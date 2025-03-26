<template>
    <div v-if="appStore.loading" class="loader-overlay">
        <div class="popup-spinner">
            <div class="spinner-border text-light" style="width: 16vw; height: 16vw;">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '../store';

const appStore = useAppStore();
</script>

<style scoped>
.loader-overlay {
    margin: 0;
    padding: 0;
    position: fixed;
    width: 102vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    z-index: 1109;
}

.popup-spinner {
    left: 0;
    top: 0;
    margin-left: calc(51vw - 8vw);
    margin-top: calc(50vh - 8vw);
    z-index: 1110;
}
</style>