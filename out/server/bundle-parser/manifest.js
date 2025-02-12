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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseManifest = parseManifest;
const path = __importStar(require("node:path"));
const semver_1 = __importDefault(require("semver"));
const project_type_1 = require("../util/project-type");
function parseManifest(pkg, bundlePath) {
    var _a;
    if (!pkg.name) {
        throw new Error(`${bundlePath}'s package.json must specify "name".`);
    }
    if (project_type_1.isLegacyProject) {
        // Check if this manifest has a nodecg property
        if (!{}.hasOwnProperty.call(pkg, "nodecg")) {
            throw new Error(`${pkg.name}'s package.json lacks a "nodecg" property, and therefore cannot be parsed.`);
        }
        if (!semver_1.default.validRange(pkg.nodecg.compatibleRange)) {
            throw new Error(`${pkg.name}'s package.json does not have a valid "nodecg.compatibleRange" property.`);
        }
        const bundleFolderName = path.basename(bundlePath);
        if (bundleFolderName !== pkg.name) {
            throw new Error(`${pkg.name}'s folder is named "${bundleFolderName}". Please rename it to "${pkg.name}".`);
        }
    }
    // Grab the standard properties from the package.json that we care about.
    const manifest = Object.assign(Object.assign({}, pkg.nodecg), { name: pkg.name, version: pkg.version, license: pkg.license, description: pkg.description, homepage: pkg.homepage, author: pkg.author, contributors: pkg.contributors, transformBareModuleSpecifiers: Boolean((_a = pkg.nodecg) === null || _a === void 0 ? void 0 : _a.transformBareModuleSpecifiers) });
    return manifest;
}
//# sourceMappingURL=manifest.js.map