import { MessageHandler } from "@bex/messaging/MessageHandler";
import { requestMessageHandlerMethods } from "./requestMessageHandlerMethods";
import createAuthHook from "./hooks/createAuthHook";
import createHistoryHook from "./hooks/createHistoryHook";

const requestMessageHandler = new MessageHandler(requestMessageHandlerMethods);
requestMessageHandler.addPreHook(createAuthHook());

const historyHook = createHistoryHook();
requestMessageHandler.addSuccessHook(historyHook);
requestMessageHandler.addFailHook(historyHook);

export default requestMessageHandler;
