import { defineConfig } from "wxt";
import { BuildTargets, ConfigBuilder } from "./vite.ConfigBuilder";

import { fileURLToPath, URL } from "node:url";

import { nodePolyfills } from "vite-plugin-node-polyfills";

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
                matches: ["<all_urls>"],
            },
        ],
    },

    vite: () => {
        const configBuilder = new ConfigBuilder({
            buildTarget: BuildTargets.PLAYGROUND,
            useDefaultRollupOptions: true,
            usePublicRPC: true,
            usePublicRPCForDevMode: true,
        });

        const config = configBuilder.config;

        (config.plugins ??= []).push(
            nodePolyfills({
                include: ["buffer"],
            })
        );

        (config.build ??= {}).sourcemap = false;
        delete config.server?.hmr;

        return config;
    },
});
