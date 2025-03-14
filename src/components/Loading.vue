<template>
    <div v-if="appStore.loading" class="loader-overlay">
        <div class="popup-spinner">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <div class="text-center">
                        <h4>Aguarde</h4>
                        <br>
                    </div>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                            aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '../store';

const appStore = useAppStore();
</script>

<style scoped>
.hidden {
    visibility: hidden;
}

.loader-overlay {
    position: fixed;
    width: 100%;
    height: 100vh;
    /* z-index: 1000; */
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    z-index: 1109;
}

.popup-spinner {
    margin-top: 15%;
    top: 0;
    /* position: absolute; */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1110;
}

.loader {
    height: 4px;
    width: 100%;
    position: relative;
    overflow: hidden;
    background-color: #FFF;
}

.loader:before {
    display: block;
    position: absolute;
    content: "";
    left: -200px;
    width: 200px;
    height: 4px;
    background-color: orange;
    animation: loading 2s linear infinite;
}

@keyframes loading {
    from {
        left: -200px;
        width: 30%;
    }

    50% {
        width: 30%;
    }

    70% {
        width: 70%;
    }

    80% {
        left: 50%;
    }

    95% {
        left: 120%;
    }

    to {
        left: 100%;
    }
}
</style>