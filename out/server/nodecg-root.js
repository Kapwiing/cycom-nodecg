"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodecgRoot = void 0;
const root_path_1 = require("./util/root-path");
/**
 * The path to have bundles, cfg, db, and assets folder. Used by tests.
 */
const getNodecgRoot = () => { var _a; return (_a = process.env["NODECG_ROOT"]) !== null && _a !== void 0 ? _a : root_path_1.rootPath; };
exports.getNodecgRoot = getNodecgRoot;
//# sourceMappingURL=nodecg-root.js.map