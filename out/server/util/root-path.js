"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootPath = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function recursivelyFindNodeJSProject(dir) {
    const packageJsonPath = node_path_1.default.join(dir, "package.json");
    if (node_fs_1.default.existsSync(packageJsonPath)) {
        return dir;
    }
    const parentDir = node_path_1.default.dirname(dir);
    if (dir === parentDir) {
        throw new Error("Could not find Node.js project");
    }
    return recursivelyFindNodeJSProject(parentDir);
}
exports.rootPath = recursivelyFindNodeJSProject(process.cwd());
//# sourceMappingURL=root-path.js.map