import type { NodeCG } from "../../types/nodecg";
export declare function parse(bundleName: string, bundleDir: string, userConfig: NodeCG.Bundle.UnknownConfig): NodeCG.Bundle.UnknownConfig;
export declare function parseDefaults(bundleName: string, bundleDir: string): Record<string, any>;
