import vault from "../Vault";
import { MessageHandlerBase } from "./MessageHandlerBase";

export class NotificationMessageHandler extends MessageHandlerBase {
    static isVaultLocked = async () => {
        return vault.isLocked;
    };

    static unlockVault = async ({ password }) => {
        await vault.unlock(password);
    };

    static getWalletsAddresses = async () => {
        return await vault.getWalletsAddresses();
    };
}
