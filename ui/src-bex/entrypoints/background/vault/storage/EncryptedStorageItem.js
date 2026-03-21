import { JSONbigNativeString } from "@mmx/wallet/utils/JSONbigNative";
import { decrypt, encrypt } from "@metamask/browser-passworder";
import { isBytes } from "@noble/hashes/utils.js";
import { base64 } from "@scure/base";

import { StorageItem } from "./StorageItem";

export class EncryptedStorageItem extends StorageItem {
    async getAsync(password) {
        if (typeof password !== "string" && !isBytes(password)) {
            throw new Error("Password must be a string or Uint8Array");
        }

        const _password = isBytes(password) ? base64.encode(password) : password;

        const encrypted = await super.getAsync();
        if (encrypted == null) {
            return null;
        }
        const decrypted = await decrypt(_password, encrypted);
        return decrypted;
    }

    async setAsync(data, password) {
        if (typeof password !== "string" && !isBytes(password)) {
            throw new Error("Password must be a string or Uint8Array");
        }

        const _password = isBytes(password) ? base64.encode(password) : password;
        const _data = JSONbigNativeString.parse(JSONbigNativeString.stringify(data));

        const encrypted = await encrypt(_password, _data);
        return await super.setAsync(encrypted);
    }
}
