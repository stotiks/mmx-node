import vault from "../Vault";
import { MessageHandlerBase } from "./MessageHandlerBase";

export class NotificationMessageHandler extends MessageHandlerBase {
    static isVaultLocked = async () => {
        return vault.isLocked;
    };

    static unlockVault = async ({ password }) => {
        await vault.unlockAsync(password);
    };

    static lockVault = async () => {
        await vault.lockAsync();
    };

    static getWalletsAddresses = () => {
        return vault.getWalletsAddresses();
    };
}
