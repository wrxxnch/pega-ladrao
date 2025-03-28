<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { firestore, storage } from '../firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useAppStore } from '../store';
import { alertMessage, formataDataHoraPtBr } from '../functions';
import { getDownloadURL, listAll, ref as refStorage } from 'firebase/storage';

const route = useRoute();
const router = useRouter();

const appStore = useAppStore();

const data = reactive({
    alert: null,
    acessos: [],
    fotos: [],
});

onBeforeMount(() => {
    appStore.loadingToggle();
});

onMounted(async () => {
    if (!route.query.id) {
        router.push({ path: '/' });
    }

    const docRef = doc(firestore, 'comprovantes', route.query.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        data.alert = alertMessage('danger', 'Comprovante não existe!');
        appStore.loadingToggle();
        return;
    }

    await getFotos(route.query.id);
    queryAcessos(route.query.id);

    appStore.loadingToggle();
});

async function queryAcessos(comprovanteId) {
    data.acessos = [];
    const q = query(collection(firestore, "acessos"), where("comprovanteId", "==", comprovanteId), orderBy('at', 'desc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let acesso = { ...doc.data() };
        acesso.id = doc.id;
        data.acessos.push(acesso);
    });
}

async function getFotos(comprovanteId) {
    data.fotos = [];
    const listRef = refStorage(storage, `capturas/${comprovanteId}`);
    await listAll(listRef)
        .then(acessos => {
            acessos.prefixes.forEach((acessosRef) => {
                data.fotos[acessosRef.name] = [];
                listAll(acessosRef)
                    .then(fotos => {
                        fotos.items.forEach(fotoRef => {
                            getDownloadURL(fotoRef)
                                .then((url) => {
                                    data.fotos[acessosRef.name].push(url);
                                })
                                .catch(erro => console.error('Erro:', erro))
                        })
                    })
            });
        }).catch((error) => {
            data.alert = alertMessage('danger', `Erro: ${error.message}`);
        });
}
</script>

<template>
    <div class="container">

        <div v-if="data.alert" :class="'alert alert-' + data.alert.class" role="alert">
            {{ data.alert.message }}
        </div>

        <div class="accordion accordion-flush" id="accordionFlush">
            <div v-for="(acesso, index) in data.acessos" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        :data-bs-target="'#item' + index" aria-expanded="false" :aria-controls="'item' + index">
                        {{ index + 1 }}. {{ formataDataHoraPtBr(acesso.at.toDate()) }}
                    </button>
                </h2>
                <div :id="'item' + index" class="accordion-collapse collapse" data-bs-parent="#accordionFlush">
                    <div class="accordion-body">
                        <p>
                            <b>ID:</b> {{ acesso.id }} <br>
                            <b>Data e Hora:</b> {{ formataDataHoraPtBr(acesso.at.toDate()) }} <br>
                            <span style="color: red;"><b>IP publico:</b> {{ acesso.publicIp }}</span>
                        </p>
                        <h5>Informações do Dispositivo</h5>
                        <hr>
                        <p>
                            <b>deviceId: </b> {{ acesso.deviceId }} <br>
                            <b>manufacturer: </b> {{ acesso.manufacturer }} <br>
                            <b>model: </b> {{ acesso.model }} <br>
                            <b>operatingSystem: </b> {{ acesso.operatingSystem }} <br>
                            <b>osVersion: </b> {{ acesso.osVersion }} <br>
                            <b>platform: </b> {{ acesso.platform }} <br>
                            <b>webViewVersion: </b> {{ acesso.webViewVersion }}
                        </p>
                        <h5>Localização</h5>
                        <hr>
                        <p>
                            <b>Precisão: </b> {{ acesso.accuracy }} <br>
                            <b>Latitude: </b> {{ acesso.latitude }} <br>
                            <b>Longitude: </b> {{ acesso.longitude }} <br><br>
                            <iframe
                                :src="`https://maps.google.com/maps?q=${acesso.latitude},${acesso.longitude}&z=15&output=embed`"
                                frameborder="1" style="width: 100%; height: 300px;"></iframe>
                        </p>
                        <h5 v-if="data.fotos[acesso.id] !== undefined" class="text-center">Fotos</h5>
                        <div v-if="data.fotos[acesso.id] !== undefined" id="carouselFotos" class="carousel slide"
                            data-bs-ride="carousel">
                            <div class="carousel-inner">
                                <div v-for="foto in data.fotos[acesso.id]" class="carousel-item active">
                                    <img :src="foto" class="d-block w-100">
                                </div>
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselFotos"
                                data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselFotos"
                                data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>