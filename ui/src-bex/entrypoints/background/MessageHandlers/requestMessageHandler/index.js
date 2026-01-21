import { MessageHandler } from "@bex/messaging/MessageHandler";
import { requestMessageHandlerMethods } from "./requestMessageHandlerMethods";
import { createAuthHook } from "./hooks/createAuthHook";
import { createHistoryHook } from "./hooks/createHistoryHook";

export const requestMessageHandler = new MessageHandler(requestMessageHandlerMethods);
requestMessageHandler.addPreHook(createAuthHook());
requestMessageHandler.addPostHook(createHistoryHook());
