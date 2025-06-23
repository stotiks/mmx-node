// eslint-disable-next-line no-restricted-imports
import * as messenger from "webext-bridge/window";
import { messengerWrapper } from "../messengerWrapper";

export const windowMessenger = messengerWrapper(messenger);
