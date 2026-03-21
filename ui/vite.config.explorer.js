import { ConfigBuilder, BuildTargets } from "./vite.ConfigBuilder";

const configBuilder = new ConfigBuilder({
    buildTarget: BuildTargets.EXPLORER,
    writeBuildInfo: true,
    writeRobotsTxt: true,
    usePublicRPC: true,
    usePublicRPCForDevMode: true,
});

export default configBuilder.config;
