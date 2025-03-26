<template>
    <h1>{{ comprovante.valor }}</h1>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAppStore } from '../store';
import { bancoInfo, formataMoedaBRL, maskCpf, pegaPrimeiroNome } from '../functions';

const route = useRoute();
const router = useRouter();

const appStore = useAppStore();

const comprovante = ref({});

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

    const banco = bancoInfo(comprovante.value.instituicao);

    if (!banco) {
        router.push({ path: '/' });
    }

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

    appStore.loadingToggle();
});

const bancoImgSrc = computed(() => {
    return new URL(`../assets/bancos/${comprovante.value.instituicao}.jpg`, import.meta.url).href
});

const faviconSrc = computed(() => {
    return new URL(`../assets/bancos/${comprovante.value.instituicao}-favicon.png`, import.meta.url).href
});
</script>