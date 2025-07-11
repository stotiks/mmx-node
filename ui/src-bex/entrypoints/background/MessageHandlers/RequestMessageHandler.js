import { MessageHandler } from "@bex/messaging/MessageHandler";
import { requestMessageHandlerMethods } from "./requestMessageHandlerMethods";
import { createAuthHook } from "./createAuthHook";
import { createHistoryHook } from "./createHistoryHook";

const requestMessageHandler = new MessageHandler(requestMessageHandlerMethods);
requestMessageHandler.addHook(createAuthHook());
requestMessageHandler.addAfterHook(createHistoryHook());
export { requestMessageHandler };
