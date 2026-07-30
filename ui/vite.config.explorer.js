import { ConfigBuilder, BuildTargets } from "./vite.ConfigBuilder.js";

const configBuilder = new ConfigBuilder({
    buildTarget: BuildTargets.EXPLORER,
});

export default configBuilder.config;
