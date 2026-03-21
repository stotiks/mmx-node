import { defineUnlistedScript } from "#imports";
import { MmxProvider } from "./MmxProvider";

export default defineUnlistedScript(async () => {
    const provider = new MmxProvider();

    // Use event-based provider announcement instead of window.mmx injection
    // Object.defineProperty(window, "mmx", {
    //     value: provider,
    //     writable: false,
    //     configurable: false,
    // });

    // similar to https://eips.ethereum.org/EIPS/eip-6963
    const announceProvider = () => {
        const announceEvent = new CustomEvent("mmx:announceProvider", { detail: Object.freeze({ provider }) });
        console.info("🧩 Fury Vault: provider announcing...");
        window.dispatchEvent(announceEvent);
    };

    window.addEventListener("mmx:requestProvider", () => {
        console.info("🧩 Fury Vault: provider request received");
        announceProvider();
    });

    console.info("🧩 Fury Vault: provider loaded");

    announceProvider();
});
