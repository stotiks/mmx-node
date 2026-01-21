import vault from "@bex/entrypoints/background/vault";
import { MessageHandler } from "@bex/messaging/MessageHandler";
import { createBlockECDSAWalletHook } from "./hooks/createBlockECDSAWalletHook";
import { createVaultLockHook } from "./hooks/createVaultLockHook";

export const vaultMessageHandler = new MessageHandler(vault);
vaultMessageHandler.addPreHook(createVaultLockHook());
vaultMessageHandler.addPreHook(createBlockECDSAWalletHook());
