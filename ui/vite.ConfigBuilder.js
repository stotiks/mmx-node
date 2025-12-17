import { defineConfig } from "vite";

import AutoImport from "unplugin-auto-import/vite";
import Fonts from "unplugin-fonts/vite";
import Components from "unplugin-vue-components/vite";

import GenerateFile from "vite-plugin-generate-file";
import { viteSingleFile } from "vite-plugin-singlefile";
import VueDevTools from "vite-plugin-vue-devtools";

import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import vue from "@vitejs/plugin-vue";

import path from "node:path";
import { fileURLToPath, URL } from "node:url";

export const BuildTargets = {
    GUI: "GUI",
    EXPLORER: "EXPLORER",
    OFFLINE: "OFFLINE",
    PLAYGROUND: "PLAYGROUND",
};

export class ConfigBuilder {
    #date = new Date();

    txQRSendBaseUrl = "https://goldfish-app-wmlwj.ondigitalocean.app";
    publicRPCUrl = "https://rpc.mmx.network";

    buildTarget = BuildTargets.GUI;
    writeBuildInfo = false;
    writeRobotsTxt = false;
    usePublicRPC = false;
    usePublicRPCForDevMode = false;
    allowCustomRPC = false;
    useDefaultRollupOptions = false;
    useSingleFile = false;

    constructor(options) {
        Object.assign(this, options);
    }

    get config() {
        const config = defineConfig(this.#getInitConfig());

        (config.build ??= {}).outDir = `dist/${this.buildTarget.toLowerCase()}`;

        (config.define ??= {}).__BUILD_TARGET__ = JSON.stringify(this.buildTarget);
        (config.define ??= {}).__TX_QR_SEND_BASE_URL__ = JSON.stringify(
            process.env.NODE_ENV === "production" ? this.txQRSendBaseUrl : undefined
        );

        (config.define ??= {}).__PUBLIC_RPC_URL__ = JSON.stringify(this.publicRPCUrl);

        if (this.usePublicRPC) {
            (config.define ??= {}).__WAPI_URL__ = JSON.stringify(
                process.env.NODE_ENV === "production" || this.usePublicRPCForDevMode ? this.publicRPCUrl : undefined
            );
        }

        (config.define ??= {}).__ALLOW_CUSTOM_RPC__ = JSON.stringify(this.allowCustomRPC);

        let generateFileOptions = [];
        if (this.writeBuildInfo) {
            const buildId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
                .toString(16)
                .toUpperCase();
            (config.define ??= {}).__BUILD_ID__ = JSON.stringify(buildId);
            generateFileOptions.push({
                type: "json",
                output: "./guiBuildInfo.json",
                data: {
                    id: buildId,
                    timestamp: this.#date.getTime(),
                    datetime: this.#date.toISOString(),
                },
            });
        }

        if (this.writeRobotsTxt) {
            const dataArray = [
                //
                "User-agent: *",
                "Disallow: /",
            ];
            generateFileOptions.push({
                type: "raw",
                output: "./robots.txt",
                data: dataArray.join("\n"),
            });
        }

        if (generateFileOptions.length > 0) {
            (config.plugins ??= []).push(GenerateFile(generateFileOptions));
        }

        if (this.useSingleFile) {
            this.useDefaultRollupOptions = true;
            (config.plugins ??= []).push(viteSingleFile());
        }

        if (this.useDefaultRollupOptions) {
            (config.build ??= {}).rollupOptions = {};
        }

        //console.log("config :", config);
        return config;
    }

    // https://vitejs.dev/config/
    #getInitConfig = () => {
        const createChunkStrategy = () => (id) => {
            //console.log(id);
            const { base } = path.parse(id);

            if (id.includes("/node_modules/")) {
                if (id.includes("@scure")) {
                    if (id.includes("wordlists")) {
                        return "@scure/wordlists/" + base;
                    } else {
                        return "@scure/index";
                    }
                }

                if (id.includes("@noble")) {
                    return "@noble";
                }

                if (id.includes("zrender") || id.includes("echarts")) {
                    return "echarts";
                }

                if (id.includes("/quasar/lang/")) {
                    return "locales/quasar/" + base;
                }

                if (id.includes("qrcode") || id.includes("dijkstrajs")) {
                    return "qrcode";
                }

                if (id.includes("axios")) {
                    return "axios";
                }

                if (id.includes("@tanstack")) {
                    return "query";
                }

                if (
                    id.includes("vue") ||
                    id.includes("pinia") ||
                    id.includes("birpc") ||
                    id.includes("@intlify") ||
                    id.includes("hookable") ||
                    id.includes("quasar") ||
                    id.includes("@mdi") ||
                    id.includes("animate.css") ||
                    id.includes("highlight.js")
                ) {
                    return "ui";
                }

                if (id.includes("json-bigint") || id.includes("bignumber.js") || id.includes("fflate")) {
                    return "mmx-wallet";
                }

                console.log(id);
                return null;
            }

            if (id.includes("/src/locales/")) {
                return "locales/" + base;
            }

            if (id.includes("/src/mmx/wallet/")) {
                return "mmx-wallet";
            }

            if (id.includes("/src/")) {
                return "app";
            }

            if (id.includes("/config/")) {
                return "mmx-config";
            }

            //console.log(id);
            return null;
        };

        const config = {
            base: "./",
            plugins: [
                VueDevTools(),
                vue({
                    template: { transformAssetUrls },
                }),
                // @quasar/plugin-vite options list:
                // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
                quasar({
                    sassVariables: fileURLToPath(new URL("./src/css/quasar.variables.scss", import.meta.url)),
                }),
                Components({ dts: true }),
                Fonts({
                    fontsource: {
                        families: [
                            {
                                name: "Roboto Flex Variable",
                                variable: {
                                    wght: true,
                                },
                            },
                            {
                                name: "Roboto Mono Variable",
                                variable: {
                                    wght: true,
                                },
                            },
                        ],
                    },
                }),
                AutoImport({
                    imports: [
                        "vue",
                        {
                            "vue-i18n": ["useI18n"],
                            "vue-router": ["useRoute", "useRouter"],
                            "@vueuse/core": ["computedAsync"],
                            pinia: ["storeToRefs"],
                            quasar: ["useQuasar"],
                        },
                    ],
                    dirs: ["src/utils/**/*", "src/composables/**/*", "src/stores/**/*"],
                    eslintrc: {
                        enabled: true,
                        filepath: fileURLToPath(new URL("./.eslintrc-auto-import.json", import.meta.url)),
                    },
                    vueTemplate: true,
                }),
            ],
            resolve: {
                alias: {
                    "@": fileURLToPath(new URL("./src", import.meta.url)),
                    "@mmxConfig": fileURLToPath(new URL("../config", import.meta.url)),
                    //"@bex": fileURLToPath(new URL("./src-bex", import.meta.url)),
                },
                extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
            },
            optimizeDeps: {
                // exclude: ["echarts"],
                entries: ["./src/**/*.{vue,js,jsx,ts,tsx}"],
            },
            css: {
                preprocessorOptions: {
                    // Use sass-embedded for better stability and performance
                    sass: {
                        api: "modern-compiler",
                    },
                    scss: {
                        api: "modern-compiler",
                    },
                },
            },
            build: {
                target: "es2020",
                //minify: false,
                chunkSizeWarningLimit: 1000,
                rollupOptions: {
                    output: {
                        manualChunks: createChunkStrategy(),
                    },
                },
            },
            server: {
                port: 3000,
                hmr: {
                    path: "/__hmr",
                    clientPort: 3000,
                },
                // warmup: {
                //     clientFiles: ["./src/components/**/*.vue", "./src/pages/**/*.vue"],
                // },
                proxy: {
                    "/api": {
                        target: "http://127.0.0.1:11380",
                        changeOrigin: true,
                    },
                    "/wapi": {
                        target: "http://127.0.0.1:11380",
                        changeOrigin: true,
                    },
                    "/server": {
                        target: "http://127.0.0.1:11380",
                        changeOrigin: true,
                    },
                },
            },
        };

        return config;
    };
}
