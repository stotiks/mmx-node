import { ConfigBuilder, BuildTargets } from "./vite.ConfigBuilder.js";

const configBuilder = new ConfigBuilder({
    buildTarget: BuildTargets.OFFLINE,
});

export default configBuilder.config;
