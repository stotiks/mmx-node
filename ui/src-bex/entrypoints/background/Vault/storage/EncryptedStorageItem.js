import { JSONbigNativeString } from "@/mmx/wallet/utils/JSONbigNative";
import { decrypt, encrypt } from "@metamask/browser-passworder";
import { abytes } from "@noble/hashes/utils.js";
import { base64 } from "@scure/base";

import { StorageItem } from "./StorageItem";

export class EncryptedStorageItem extends StorageItem {
    async getAsync(encryptionBytes) {
        abytes(encryptionBytes);
        const password = base64.encode(encryptionBytes);
        const encrypted = await super.getAsync();
        const decrypted = await decrypt(password, encrypted);
        return decrypted;
    }

    async setAsync(data, encryptionBytes) {
        abytes(encryptionBytes);
        const password = base64.encode(encryptionBytes);
        const _data = JSONbigNativeString.parse(JSONbigNativeString.stringify(data));
        const encrypted = await encrypt(password, _data);
        return await super.setAsync(encrypted);
    }
}
