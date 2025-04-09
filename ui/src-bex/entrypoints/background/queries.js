const getData = (endpoint) => {
    // eslint-disable-next-line no-undef
    const url = new URL(endpoint, __PUBLIC_RPC_URL__);
    return fetch(url).then((res) => res.json());
};

export const getNodeInfo = () => getData("/node/info");
