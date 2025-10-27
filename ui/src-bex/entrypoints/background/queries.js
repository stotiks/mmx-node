const getData = (endpoint, params) => {
    const url = new URL(endpoint, __PUBLIC_RPC_URL__);
    return fetch(url + `?${new URLSearchParams(params)}`).then((res) => res.json());
};

export const getNodeInfoAsync = () => getData("/node/info");

export const getContractAsync = (address) => getData("/contract", { id: address });
