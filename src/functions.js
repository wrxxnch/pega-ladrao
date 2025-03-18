function copyToClipboard() {
    navigator.clipboard.writeText(data.result);
    alert('Texto copiado para a área de transferência.');
}

function alert(type, message) {
    return {
        'class': type,
        'message': message
    }
}

export {
    copyToClipboard,
    alert
}