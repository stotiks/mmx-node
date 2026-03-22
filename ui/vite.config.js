import { ConfigBuilder, BuildTargets } from "./vite.ConfigBuilder";

const configBuilder = new ConfigBuilder({
    buildTarget: BuildTargets.GUI,
});

export default configBuilder.config;
