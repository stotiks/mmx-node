const getData = (endpoint, params) => {
    const url = new URL(endpoint, __PUBLIC_RPC_URL__);
    return fetch(url + `?${new URLSearchParams(params)}`).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            if (text) {
                throw new Error(text);
            } else {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
        }
        return res.json();
    });
};

const postData = (endpoint, payload) => {
    const url = new URL(endpoint, __PUBLIC_RPC_URL__);
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: payload,
    }).then(async (res) => {
        if (!res.ok) {
            const text = await res.text();
            if (text) {
                throw new Error(text);
            } else {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
        }

        const text = await res.text();
        if (!text || text.trim() === "") {
            return;
        }

        return JSON.parse(text);
    });
};

export const getNodeInfoAsync = () => getData("/node/info");

export const getContractAsync = (address) => getData("/contract", { id: address });

export const sendTransactionAsync = (tx) => postData("/transaction/broadcast", tx.toString());
