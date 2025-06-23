// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/content-script";
import { messengerWrapper } from "../messengerWrapper";

export const contentScriptMessenger = messengerWrapper(messenger);
