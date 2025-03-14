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
        <textarea class="form-control" id="msgBruta" rows="5"></textarea>
    </div>
    <div class="mb-3">
        <label for="msgKey" class="form-label">🔑 Chave secreta</label>
        <input type="text" class="form-control" id="msgKey" placeholder="Sp1k3" maxlength="20">
    </div>
    <div class="mb-3">
        <label for="msgTip" class="form-label">💡 Dica da chave secreta</label>
        <input type="text" class="form-control" id="msgTip" maxlength="50" placeholder="Meu primeiro pet">
    </div>
    <div class="mb-3 text-center">
        <button type="button" class="btn btn-success btn-lg">Criptografar 🥷</button>
    </div>
    <br>
    <Ads />
    <br>
    <div class="mb-3">
        <h2>Resultado</h2>
        <textarea class="form-control" id="msgEnc" rows="5" readonly></textarea>
    </div>
    <div class="mb-3 text-center">
        <button @click="loading" type="button" class="btn btn-info btn-lg">Copiar</button>
    </div>
</template>

<script setup>
import Ads from '../components/Ads.vue';
import { useAppStore } from '../store';

const appStore = useAppStore();

function loading(){
    appStore.loadingToggle();
}
</script>