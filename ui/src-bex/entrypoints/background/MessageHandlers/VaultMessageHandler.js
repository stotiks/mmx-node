import { MessageHandler } from "@bex/messaging/MessageHandler";
import vault from "@bex/entrypoints/background/Vault";

export const vaultMessageHandler = new MessageHandler(vault);
