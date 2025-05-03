import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import vault from "../storage/vault";

export const vaultMessageHandler = new MessageHandlerBase(vault);
