import { defineConfig, normalizePath } from "vite";

import AutoImport from "unplugin-auto-import/vite";
import Unfonts from "unplugin-fonts/vite";
import Components from "unplugin-vue-components/vite";

import GenerateFile from "vite-plugin-generate-file";
import VueDevTools from "vite-plugin-vue-devtools";
import { viteSingleFile } from "vite-plugin-singlefile";
import { viteStaticCopy } from "vite-plugin-static-copy";

import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import vue from "@vitejs/plugin-vue";

import path from "node:path";
import { fileURLToPath, URL } from "node:url";
import { searchForWorkspaceRoot } from "vite";

export const BuildTargets = {
    GUI: "GUI",
    EXPLORER: "EXPLORER",
    OFFLINE: "OFFLINE",
    PLAYGROUND: "PLAYGROUND",
    NONE: "NONE",
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
    useDefaultRolldownOptions = false;
    createSingleFile = false;

    static #buildTargetDefaults = {
        [BuildTargets.GUI]: {
            writeBuildInfo: true,
            writeRobotsTxt: true,
        },
        [BuildTargets.EXPLORER]: {
            writeBuildInfo: true,
            writeRobotsTxt: true,
            usePublicRPC: true,
            usePublicRPCForDevMode: true,
            useDefaultRollupOptions: true,
        },
        [BuildTargets.OFFLINE]: {
            usePublicRPC: true,
            createSingleFile: true,
        },
        [BuildTargets.PLAYGROUND]: {},
        [BuildTargets.NONE]: {},
    };

    constructor(options) {
        const target = options?.buildTarget ?? this.buildTarget;
        const targetDefaults = ConfigBuilder.#buildTargetDefaults[target] ?? {};
        Object.assign(this, targetDefaults, options);
    }

    get config() {
        const config = defineConfig(this.#getInitConfig());

        config.build ??= {};
        config.define ??= {};
        config.plugins ??= [];

        this.#applyDefines(config);
        this.#addGenerateFilePlugin(config);

        if (this.createSingleFile) {
            this.useDefaultRolldownOptions = true;
            config.plugins.push(viteSingleFile());
        }

        if (this.useDefaultRolldownOptions) {
            config.build.rolldownOptions = {};
        }

        config.build.outDir = `dist/${this.buildTarget.toLowerCase()}`;

        //console.log("config :", config);
        return config;
    }

    #addGenerateFilePlugin(config) {
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
            config.plugins.push(GenerateFile(generateFileOptions));
        }

        if (this.buildTarget === BuildTargets.EXPLORER) {
            config.plugins.push(
                viteStaticCopy({
                    targets: [
                        {
                            src: normalizePath(path.resolve(__dirname, ".output/*.zip")),
                            dest: "downloads/bex/",
                            rename: { stripBase: 1 },
                        },
                    ],
                })
            );
        }
    }

    #getRoutesFile() {
        const routesMap = {
            [BuildTargets.GUI]: "guiRoutes.js",
            [BuildTargets.EXPLORER]: "explorerRoutes.js",
            [BuildTargets.OFFLINE]: "offlineRoutes.js",
            [BuildTargets.PLAYGROUND]: "playgroundRoutes.js",
            [BuildTargets.NONE]: "emptyRoutes.js",
        };
        const file = routesMap[this.buildTarget];
        if (!file) {
            throw new Error(`No routes file for build target: ${this.buildTarget}`);
        }
        return file;
    }

    #getMenuFile() {
        const menuMap = {
            [BuildTargets.GUI]: "GuiMainMenu.vue",
            [BuildTargets.EXPLORER]: "ExplorerMainMenu.vue",
            [BuildTargets.OFFLINE]: "OfflineMainMenu.vue",
            [BuildTargets.PLAYGROUND]: "EmptyMainMenu.vue",
            [BuildTargets.NONE]: "EmptyMainMenu.vue",
        };
        const file = menuMap[this.buildTarget];
        if (!file) {
            throw new Error(`No menu file for build target: ${this.buildTarget}`);
        }
        return file;
    }

    #applyDefines(config) {
        const defines = {};

        defines.__BUILD_TARGET__ = this.buildTarget;
        defines.__PUBLIC_RPC_URL__ = this.publicRPCUrl;
        defines.__ALLOW_CUSTOM_RPC__ = this.allowCustomRPC;

        defines.__TX_QR_SEND_BASE_URL__ = process.env.NODE_ENV === "production" ? this.txQRSendBaseUrl : undefined;

        if (this.usePublicRPC) {
            defines.__WAPI_URL__ =
                process.env.NODE_ENV === "production" || this.usePublicRPCForDevMode ? this.publicRPCUrl : undefined;
        }

        config.define ??= {};
        for (const [key, value] of Object.entries(defines)) {
            config.define[key] = JSON.stringify(value);
        }
    }

    // https://vitejs.dev/config/
    #getInitConfig = () => {
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
                Unfonts({
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
                            quasar: ["useQuasar", "useDialogPluginComponent"],
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
                    "@mmx": fileURLToPath(new URL("./src/mmx", import.meta.url)),
                    "@mmxConfig": fileURLToPath(new URL("../config", import.meta.url)),
                    "@buildRoutes": fileURLToPath(
                        new URL(`./src/router/routes/${this.#getRoutesFile()}`, import.meta.url)
                    ),
                    "@buildMenu": fileURLToPath(
                        new URL(`./src/components/MainMenu/${this.#getMenuFile()}`, import.meta.url)
                    ),
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
                chunkSizeWarningLimit: 1000,
                rolldownOptions: {
                    output: {
                        assetFileNames: (assetInfo) => {
                            const name = assetInfo.name || (assetInfo.names ? assetInfo.names[0] : "");
                            if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(name)) {
                                return "assets/fonts/[name]-[hash][extname]";
                            }
                            return "assets/[name]-[hash][extname]";
                        },
                        codeSplitting: {
                            groups: [],
                        },
                    },
                },
            },
            server: {
                fs: {
                    allow: [
                        // search up for workspace root
                        searchForWorkspaceRoot(process.cwd()),
                        // custom rules
                        "../config",
                    ],
                },

                port: 3000,
                hmr: {
                    path: "/__hmr",
                    clientPort: 3000,
                },
                warmup: {
                    clientFiles: ["./src/**/*.vue"],
                },
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
