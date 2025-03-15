<template>
    <div class="modal fade" id="handleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="handleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="handleModalLabel">Descriptografar Mensagem</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-if="data.alert != null" class="mb-3">
                        <div :class="'alert alert-' + data.alert.class" role="alert">
                            {{ data.alert.message }}
                        </div>
                    </div>
                    ola {{ data.msg }}!
                    <br>
                    <br>
                    <br>
                    <Ads />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Ads from './Ads.vue';
import { onMounted, reactive } from 'vue';
import { useAppStore } from '../store';
import { useRoute } from 'vue-router';

const data = reactive({
    msg: '',
    alert: null
});

const route = useRoute();
const appStore = useAppStore();

onMounted(() => {
    if (route.query?.msg === 'WilliamSampaio97') {
        data.msg = route.query.msg;
        const myModalEl = document.querySelector('#handleModal');
        const modal = bootstrap.Modal.getOrCreateInstance(myModalEl);
        modal.show();
    }
});
</script>