import { defineUnlistedScript } from "#imports";
import { MmxProvider } from "./MmxProvider";

export default defineUnlistedScript(async () => {
    window.mmx = new MmxProvider();
    console.info("🧩 Fury Vault: provider loaded");
});
