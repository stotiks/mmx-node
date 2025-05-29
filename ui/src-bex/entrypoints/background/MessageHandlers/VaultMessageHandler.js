import { MessageHandlerBase } from "@bex/messaging/utils/MessageHandlerBase";
import vault from "../stores/vault";

export const vaultMessageHandler = new MessageHandlerBase(vault);
