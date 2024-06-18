function baseFunction(msg) {
    msg.payload = msg.payload.qrCode;

    const base64Prefix = 'data:image/png;base64,';
    if (msg.payload.startsWith(base64Prefix)) {
        msg.payload = msg.payload.slice(base64Prefix.length);
    }

    return msg;
}
