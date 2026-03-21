const txQrSendRoute = {
    name: "tx-qr-send",
    path: "/tx/qr/send/:txData",
    component: () => import("@/pages/Offline/TxQrSend.vue"),
    props: (route) => ({ txData: route.params.txData }),
    meta: {
        title: "QR TX Send",
    },
};

export default txQrSendRoute;
