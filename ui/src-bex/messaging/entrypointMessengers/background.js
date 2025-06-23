// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/background";
import { messengerWrapper } from "../utils/messengerWrapper";

export const backgroundMessenger = messengerWrapper(messenger);
