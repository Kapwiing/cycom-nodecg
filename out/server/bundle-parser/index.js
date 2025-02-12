"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBundle = parseBundle;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const assets_1 = require("./assets");
const config = __importStar(require("./config"));
const extension_1 = require("./extension");
const git_1 = require("./git");
const graphics_1 = require("./graphics");
const manifest_1 = require("./manifest");
const mounts_1 = require("./mounts");
const panels_1 = require("./panels");
const sounds_1 = require("./sounds");
function parseBundle(bundlePath, bundleCfg) {
    // Resolve the path to the bundle and its package.json
    const pkgPath = path.join(bundlePath, "package.json");
    if (!fs.existsSync(pkgPath)) {
        throw new Error(`Bundle at path ${bundlePath} does not contain a package.json!`);
    }
    // Read metadata from the package.json
    let pkg;
    try {
        pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    }
    catch (_) {
        throw new Error(`${pkgPath} is not valid JSON, please check it against a validator such as jsonlint.com`);
    }
    const dashboardDir = path.resolve(bundlePath, "dashboard");
    const graphicsDir = path.resolve(bundlePath, "graphics");
    const manifest = (0, manifest_1.parseManifest)(pkg, bundlePath);
    let nodecgBundleConfig;
    try {
        const importedConfig = require(path.join(bundlePath, "nodecg.config.js"));
        nodecgBundleConfig = importedConfig.default || importedConfig;
    }
    catch (_a) {
        nodecgBundleConfig = {};
    }
    if (typeof nodecgBundleConfig !== "object") {
        throw new Error("nodecg.config.js must export an object");
    }
    const bundle = Object.assign(Object.assign(Object.assign(Object.assign({}, manifest), { dir: bundlePath, 
        // If there is a config file for this bundle, parse it.
        // Else if there is only a configschema for this bundle, parse that and apply any defaults.
        config: bundleCfg
            ? config.parse(manifest.name, bundlePath, bundleCfg)
            : config.parseDefaults(manifest.name, bundlePath), dashboard: {
            dir: dashboardDir,
            panels: (0, panels_1.parsePanels)(dashboardDir, manifest),
        }, mount: (0, mounts_1.parseMounts)(manifest), graphics: (0, graphics_1.parseGraphics)(graphicsDir, manifest), assetCategories: (0, assets_1.parseAssets)(manifest), hasExtension: (0, extension_1.parseExtension)(bundlePath, manifest), git: (0, git_1.parseGit)(bundlePath) }), (0, sounds_1.parseSounds)(bundlePath, manifest)), { nodecgBundleConfig });
    return bundle;
}
//# sourceMappingURL=index.js.map