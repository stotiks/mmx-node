import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import vault from "../storage/vault";

export class PopupMessageHandler extends MessageHandlerBase {
    static getIsLocked = async () => {
        return vault.isLocked;
    };

    static unlockVault = async ({ password }) => {
        return await vault.unlockAsync({ password });
    };

    static lockVault = async () => {
        return await vault.lockAsync();
    };

    static updatePassword = async ({ password, newPassword }) => {
        return await vault.updatePasswordAsync({ password, newPassword });
    };

    static getWallets = () => {
        return vault.getWallets();
    };

    static addWallet = async ({ mnemonic, password }) => {
        return await vault.addWalletAsync({ mnemonic, password });
    };

    static removeWallet = async ({ address }) => {
        return await vault.removeWalletAsync({ address });
    };

    static getCurrentWalletAddress = () => {
        return vault.getCurrentWalletAddress();
    };

    static setCurrentWallet = ({ address }) => {
        return vault.setCurrentWallet(address);
    };
}
