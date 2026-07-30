import { ConfigBuilder, BuildTargets } from "./vite.ConfigBuilder.js";

const configBuilder = new ConfigBuilder({
    buildTarget: BuildTargets.GUI,
});

export default configBuilder.config;
