function sentJsonFunc(msg) {
    msg.payload = {
        subscriptionId: msg.payload.value.subscriptionId,
        userId: msg.payload.value.userId
    };

    return msg;
}