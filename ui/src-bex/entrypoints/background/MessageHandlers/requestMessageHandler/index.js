import { MessageHandler } from "@bex/messaging/MessageHandler";
import { requestMessageHandlerMethods } from "./requestMessageHandlerMethods";
import createAuthHook from "./hooks/createAuthHook";
import createHistoryHook from "./hooks/createHistoryHook";
import createSetResultHook from "./hooks/createSetResultHook";

const requestMessageHandler = new MessageHandler(requestMessageHandlerMethods);

requestMessageHandler.addPreHook(createAuthHook());
requestMessageHandler.addPostHook(createSetResultHook(), { ignoreFail: true });
requestMessageHandler.addPostHook(createHistoryHook());

export default requestMessageHandler;
