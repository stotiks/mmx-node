import { promisify } from "./promisify";

const getFingerPrintAsync = async (seed_value, passphrase) =>
    await promisify("getFingerPrint", [seed_value, passphrase]);

const getFarmerKeyAsync = async (seed_value) => await promisify("getFarmerKey", [seed_value]);

const getAddressAsync = async (seed_value, passphrase, index) =>
    await promisify("getAddress", [seed_value, passphrase, index]);

const getKeysAsync = async (seed_value, passphrase, index) => promisify("getKeys", [seed_value, passphrase, index]);

const signAsync = async (privKey, msg) => promisify("sign", [privKey, msg]);

export {
    //
    getFingerPrintAsync,
    getFarmerKeyAsync,
    getAddressAsync,
    getKeysAsync,
    signAsync,
};
