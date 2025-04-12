import vault from "../Vault";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";

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

    static updatePassword = async ({ password, newPassword }) => {
        await vault.updatePasswordAsync(password, newPassword);
    };

    static getWalletsAddresses = () => {
        return vault.getWalletsAddresses();
    };
}
