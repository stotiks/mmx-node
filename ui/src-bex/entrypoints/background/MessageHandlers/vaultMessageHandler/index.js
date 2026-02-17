import vault from "@bex/entrypoints/background/vault";
import { MessageHandler } from "@bex/messaging/MessageHandler";
import createBlockECDSAWalletHook from "./hooks/createBlockECDSAWalletHook";

const vaultMessageHandler = new MessageHandler(vault);
vaultMessageHandler.addPreHook(createBlockECDSAWalletHook());

export default vaultMessageHandler;
