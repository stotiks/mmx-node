import { MessageHandler } from "@bex/messaging/MessageHandler";
import { requestMessageHandlerMethods } from "./requestMessageHandlerMethods";
import { createAuthHook } from "./createAuthHook";

const requestMessageHandler = new MessageHandler(requestMessageHandlerMethods);
requestMessageHandler.addHook(createAuthHook());
export { requestMessageHandler };
