import { defineUnlistedScript } from "#imports";
import { MmxProvider } from "./MmxProvider";

export default defineUnlistedScript(async () => {
    Object.defineProperty(window, "mmx", {
        value: new MmxProvider(),
        writable: false,
        configurable: false,
    });
    console.info("🧩 Fury Vault: provider loaded");
});
