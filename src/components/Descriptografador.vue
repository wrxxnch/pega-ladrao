<template>
    <div class="alert alert-success" role="alert">
        Clique no botão abaixo para <b>DESCRIPTOGRAFAR</b> uma mensagem.<br><br>
        <button type="button" class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#decodeModel">
            Descriptografar Mensagem 🔓
        </button>
    </div>
    <div class="modal fade" id="decodeModel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="decodeModelLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="decodeModelLabel">Descriptografar Mensagem</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="data.alert != null" class="mb-3">
                        <div :class="'alert alert-' + data.alert.class" role="alert">
                            {{ data.alert.message }}
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="msgEncoded" class="form-label">📜 Digite aqui sua mensagem criptografada</label>
                        <textarea class="form-control font-monospace" id="msgEncoded" rows="5"
                            v-model="data.msgEncoded"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="msgKey" class="form-label">🔑 Chave secreta</label>
                        <input type="text" class="form-control" id="msgKey" v-model="data.msgKey">
                    </div>
                    <div class="mb-3 text-center d-flex justify-content-between">
                        <button @click="decode" type="button" class="btn btn-success">Descriptografar 🔓</button>
                        <button @click="clear" type="button" class="btn btn-warning">Limpar 🧹</button>
                    </div>
                    <br>
                    <Ads />
                    <div class="mb-3">
                        <h2>Mensagem</h2>
                        <div class="card text-center mb-3">
                            <div class="card-body">
                                <p class="card-text overflow-auto text-break font-monospace mb-3"
                                    style="max-height: 200px;">
                                    {{ data.result || '...' }}
                                </p>
                                <hr>
                                <div class="mb-3 text-center d-flex justify-content-between">
                                    <button :disabled="data.result.length == 0 ? true : false"
                                        @click="copyToClipboard(data.result)" type="button" class="btn btn-info">
                                        Copiar 📋
                                    </button>
                                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                                        Fechar ❌
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Ads from './Ads.vue';
import { reactive } from 'vue';
import { useAppStore } from '../store';
import { alertMessage, copyToClipboard, decrypt } from '../functions';

const data = reactive({
    msgEncoded: '',
    msgKey: '',
    result: '',
    alert: null
});

const appStore = useAppStore();

async function decode() {
    data.result = '';
    data.alert = null;

    if (data.msgEncoded == false || data.msgKey == false) {
        alert('Todos os campos devem ser preenchidos!');
        return;
    }

    appStore.loadingToggle();

    const decrypted = decrypt(data.msgEncoded, data.msgKey);

    if (!decrypted) {
        data.alert = alertMessage('danger', 'Chave secreta incorreta ou inválida!');
        appStore.loadingToggle();
        return;
    }
    data.result = decrypted;
    appStore.loadingToggle();
}

function clear() {
    data.msgEncoded = '';
    data.msgKey = '';
    data.result = '';
    data.alert = null;
}
</script>