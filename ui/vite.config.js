import { ConfigBuilder, BuildTargets } from "./vite.ConfigBuilder";

const configBuilder = new ConfigBuilder({
    buildTarget: BuildTargets.GUI,
    writeBuildInfo: true,
    writeRobotsTxt: true,
});

export default configBuilder.config;
