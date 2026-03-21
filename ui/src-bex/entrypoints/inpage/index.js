import { defineUnlistedScript } from "#imports";
import { MmxProvider } from "./MmxProvider";

export default defineUnlistedScript(async () => {
    const provider = new MmxProvider();
    Object.defineProperty(window, "mmx", {
        value: provider,
        writable: false,
        configurable: false,
    });
    document.dispatchEvent(
        new CustomEvent("mmx-provider-loaded", {
            detail: {
                provider,
            },
        })
    );
    console.info("🧩 Fury Vault: provider loaded");
});
