<template>
    <div class="modal fade" id="handleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="handleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="handleModalLabel">Mensagem de {{ data.nome }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <Ads />
                    <div v-if="data.alert != null" class="mb-3">
                        <div :class="'alert alert-' + data.alert.class" role="alert">
                            {{ data.alert.message }}
                        </div>
                    </div>
                    <div class="card text-center mb-3">
                        <div class="card-body">
                            <p class="card-text overflow-auto text-break font-monospace mb-3"
                                style="max-height: 200px;">
                                {{ data.secretMessage }}
                            </p>
                            <hr>
                            <button @click="copySecretMessage" class="btn btn-primary">Copiar 📋</button>
                        </div>
                    </div>
                    <h5 class="card-title mb-3">Descriptografar Mensagem 🔓</h5>
                    <div class="mb-3">
                        <label for="inputSecretKey" class="form-label">
                            Informe a chave secreta 🔑
                            <a class="btn btn-link btn-sm" data-bs-toggle="collapse" href="#collapseTip" role="button"
                                aria-expanded="false" aria-controls="collapseTip">
                                (Ver dica)
                            </a>
                        </label>
                        <div class="collapse" id="collapseTip">
                            <div class="alert alert-info text-center" role="alert">
                                <b style="color: red;">{{ data.tip }}</b>
                            </div>
                        </div>
                        <div class="row g-3">
                            <div class="col">
                                <input type="text" class="form-control" id="inputSecretKey">
                            </div>
                            <div class="col-auto">
                                <button class="btn btn-primary mb-3">Escanear 📷</button>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="card text-center mb-3">
                        <div class="card-body">
                            <p class="card-text overflow-auto text-break font-monospace mb-3"
                                style="max-height: 200px;">...</p>
                            <hr>
                            <button disabled="true" class="btn btn-primary">
                                Copiar 📋
                            </button>
                        </div>
                    </div> -->
                    <br>
                    <button @click="requestCameraPermission" type="button"
                        class="btn btn-primary btn-lg">Ativar</button>
                    <button id="capture-btn" class="btn btn-primary btn-lg">Capture Photo</button>
                    <br>
                    <br>
                </div>
            </div>
        </div>
    </div>
    <video id="camera" autoplay></video>

    <canvas id="photo"></canvas>
</template>

<script setup>
import Ads from './Ads.vue';
import { onMounted, reactive } from 'vue';
import { useAppStore } from '../store';
import { useRoute } from 'vue-router';

const data = reactive({
    nome: '',
    secretMessage: "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",
    tip: 'super dica! te vira!',
    video: null,
    canvas: null,
    captureBtn: null,
    alert: null
});

const route = useRoute();
const appStore = useAppStore();

onMounted(() => {
    if (route.query?.msg === 'WilliamSampaio97') {
        data.nome = route.query.msg;
        const myModalEl = document.querySelector('#handleModal');
        const modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
        modal.show();

        data.video = document.getElementById('camera');
        data.canvas = document.getElementById('photo');
        data.captureBtn = document.getElementById('capture-btn');

        const downloadLink = document.createElement('a');
        downloadLink.innerText = 'Download Photo';
        document.body.appendChild(downloadLink);

        // Capture photo on button click
        data.captureBtn.addEventListener('click', () => {
            data.canvas.width = data.video.videoWidth;
            data.canvas.height = data.video.videoHeight;

            const context = data.canvas.getContext('2d');

            context.drawImage(data.video, 0, 0, data.canvas.width, data.canvas.height);

            // Convert the canvas image to a data URL
            const dataURL = data.canvas.toDataURL('image/png');

            console.log(dataURL);

            // Set the download link
            downloadLink.href = dataURL;
            downloadLink.download = 'captured-photo.png';
            downloadLink.style.display = 'block';
            downloadLink.click();
        });
    }
});

function request() {
    // Request access to the user's camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            data.video.srcObject = stream;
        })
        .catch((error) => {
            console.error("Error accessing the camera: ", error);
        });
}

function requestNotificationPermission() {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission()
            .then(permission => {
                if (permission !== 'granted') {
                    alert('Ops! Você não concedeu permissão de notificação, pode ser que alguns recursos não funcionem adequadamente.');
                }
            });
    }
}

function requestCameraPermission() {
    navigator.permissions.query({ name: "camera" }).then(res => {
        if (res.state !== 'granted') {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    data.video.srcObject = stream;
                })
                .catch((error) => {
                    console.error("Error accessing the camera: ", error);
                });
        }
    });
}

function copySecretMessage() {
    navigator.clipboard.writeText(data.secretMessage);
    alert('Texto copiado para a área de transferência.');
}
</script>