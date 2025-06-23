import { MessageHandler } from "@bex/messaging/MessageHandler";
import { RequestMessageHandlerMethods } from "./RequestMessageHandlerMethods";
import { createAuthHook } from "./createAuthHook";

const requestMessageHandler = new MessageHandler(RequestMessageHandlerMethods);
requestMessageHandler.addHook(createAuthHook());
export { requestMessageHandler };
