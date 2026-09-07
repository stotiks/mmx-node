import globals from "globals";
import pluginJs from "@eslint/js";
import pinia from "eslint-plugin-pinia";
import pluginVue from "eslint-plugin-vue";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginSecurity from "eslint-plugin-security";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig, globalIgnores, includeIgnoreFile } from "eslint/config";

import { join } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

let autoImportConfig = { globals: {} };
try {
    autoImportConfig = JSON.parse(readFileSync(join(import.meta.dirname, "./.eslintrc-auto-import.json"), "utf8"));
} catch {
    // File may not exist yet if auto-import hasn't run
}

export default defineConfig([
    includeIgnoreFile(gitignorePath, { gitignoreResolution: true }),
    globalIgnores(["dist/**/*"], "Ignore Build Directory"),

    {
        languageOptions: {
            globals: {
                __BUILD_TARGET__: "readonly",
                __BUILD_ID__: "readonly",
                __WAPI_URL__: "readonly",
                __ALLOW_CUSTOM_RPC__: "readonly",
                __PUBLIC_RPC_URL__: "readonly",
                __TX_QR_SEND_BASE_URL__: "readonly",
                ...autoImportConfig.globals,
                ...globals.node,
                ...globals.browser,
            },
        },
    },

    pluginSecurity.configs.recommended,
    pluginJs.configs.recommended,
    pinia.configs["recommended-flat"],
    ...pluginVue.configs["flat/recommended"],
    ...pluginQuery.configs["flat/recommended"],
    eslintPluginPrettierRecommended,

    {
        rules: {
            "prettier/prettier": "warn",
            "no-unused-vars": "off",

            "vue/multi-word-component-names": "off",
            "vue/v-slot-style": "off",
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["webext-bridge", "webext-bridge/*"],
                            message: "Use the wrapper except in designated files",
                        },
                    ],
                },
            ],
        },
    },
]);
