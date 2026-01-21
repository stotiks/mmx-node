// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/content-script";
import messengerWrapper from "../messengerWrapper";

const contentScriptMessenger = messengerWrapper(messenger);

export default contentScriptMessenger;
