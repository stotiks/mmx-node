export const getTransactionVersion = (params, height) => {
    return height >= params.hardfork2_height ? 1 : 0;
};
