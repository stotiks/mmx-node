import { ChainParams } from "./ChainParams";

const chainParamsList = import.meta.glob(`@mmxConfig/(mainnet|mainnet-rc|testnet??)/chain/params.json`);
const chainExtraParamsList = import.meta.glob(`@mmxConfig/(mainnet|mainnet-rc|testnet??)/chain/params/(*)`, {
    query: "?raw",
    import: "default",
    eager: true,
});

const chainParamsCache = new Map();
export const getChainParamsAsync = async (network) => {
    let chainParams = chainParamsCache.get(network);

    if (chainParams) {
        return chainParams;
    } else {
        // get chain params
        const paths = Object.keys(chainParamsList).filter((key) => key.endsWith(`${network}/chain/params.json`));
        if (paths.length === 0) {
            throw new Error(`Chain params not found for network: ${network}`);
        }
        const chainParamsTmp = await chainParamsList[paths[0]]();

        chainParams = { ...chainParamsTmp };
        // get chain extra params
        const extraPath = Object.keys(chainExtraParamsList).filter((key) => key.includes(`${network}/chain/params/`));
        for (const key of extraPath) {
            const match = key.match(/\/chain\/params\/(.*)$/);
            if (!match) continue;

            const param = match[1];
            const extraParam = chainExtraParamsList[key];
            chainParams[param] = extraParam.trim();
        }

        const res = new ChainParams(chainParams);
        chainParamsCache.set(network, new ChainParams(chainParams));
        return res;
    }
};
