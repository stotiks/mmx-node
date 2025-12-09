import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default defineConfig(() =>
    mergeConfig(
        viteConfig,
        defineConfig({
            test: {
                projects: [
                    // {
                    //     extends: true,
                    //     test: {
                    //         include: ["src/mmx/**/*.test.{ts,js}"],
                    //         name: "node",
                    //         environment: "node",
                    //         // globals: true,
                    //         // mockReset: true,
                    //     },
                    // },
                    {
                        extends: true,
                        test: {
                            name: "happy-dom",
                            environment: "happy-dom",
                        },
                    },
                    // {
                    //     extends: true,
                    //     test: {
                    //         name: "node",
                    //         environment: "node",
                    //     },
                    // },
                ],
            },
        })
    )
);
