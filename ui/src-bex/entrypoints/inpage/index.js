import { MmxProvider } from "./MmxProvider";

import { defineUnlistedScript } from "#imports";

export default defineUnlistedScript(async () => {
    window.mmx = new MmxProvider();
    console.info("🧩 Fury Vault: provider loaded");
});
