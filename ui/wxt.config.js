import { defineConfig } from "wxt";
import { BuildTargets, ConfigBuilder } from "./vite.ConfigBuilder";

import { fileURLToPath, URL } from "node:url";

// See https://wxt.dev/api/config.html
export default defineConfig({
    srcDir: "src",
    entrypointsDir: "../src-bex/entrypoints",
    publicDir: "./src-bex/public",

    imports: false,

    alias: {
        "@bex": fileURLToPath(new URL("./src-bex", import.meta.url)),
    },

    manifest: {
        name: "Fury Vault",
        version: "0.0.1",
        permissions: ["storage"],
        web_accessible_resources: [
            {
                resources: ["inpage.js"],
                matches: ["*://*/*"],
            },
        ],
    },

    vite: () => {
        const configBuilder = new ConfigBuilder({
            buildTarget: BuildTargets.PLAYGROUND,
            useDefaultRollupOptions: true,
        });

        const config = configBuilder.config;
        (config.build ??= {}).sourcemap = false;
        delete config.server?.hmr;

        return config;
    },
});
