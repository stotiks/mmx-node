import { internalMessenger } from "@bex/messaging/popup";
import { VaultMessageHandler } from "../MessageHandlers/VaultMessageHandler";

export const useVaultMessageHandler = () => {
    internalMessenger.onMessage("vault", async (message) => {
        return await VaultMessageHandler.handle(message);
    });
};
