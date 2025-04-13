import vault from "../Vault";
import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";

export class NotificationMessageHandler extends MessageHandlerBase {
    static isLocked = async () => {
        return vault.isLocked;
    };

    static unlockVault = async ({ password }) => {
        return await vault.unlockAsync(password);
    };

    static lockVault = async () => {
        return await vault.lockAsync();
    };

    static updatePassword = async ({ password, newPassword }) => {
        return await vault.updatePasswordAsync(password, newPassword);
    };

    static getWallets = () => {
        return vault.getWallets();
    };

    static addWallet = async ({ seed, password }) => {
        return await vault.addWalletAsync(seed, password);
    };
}
