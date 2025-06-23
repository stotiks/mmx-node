import { MessageHandler } from "@bex/messaging/MessageHandler";
import vault from "../stores/vault";

export const vaultMessageHandler = new MessageHandler(vault);
