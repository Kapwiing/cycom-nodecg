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
exports.parse = parse;
exports.parseDefaults = parseDefaults;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const extend_1 = __importDefault(require("extend"));
const json_1 = require("klona/json");
const compileJsonSchema_1 = require("../../shared/utils/compileJsonSchema");
const errors_1 = require("../../shared/utils/errors");
function parse(bundleName, bundleDir, userConfig) {
    const cfgSchemaPath = path.resolve(bundleDir, "configschema.json");
    if (!fs.existsSync(cfgSchemaPath)) {
        return userConfig;
    }
    const schema = _parseSchema(bundleName, cfgSchemaPath);
    const defaultConfig = (0, compileJsonSchema_1.getSchemaDefault)(schema, bundleName);
    let validateUserConfig;
    try {
        validateUserConfig = (0, compileJsonSchema_1.compileJsonSchema)(schema);
    }
    catch (error) {
        throw new Error(`Error compiling JSON Schema for bundle config "${bundleName}":\n\t${(0, errors_1.stringifyError)(error)}`);
    }
    const userConfigValid = validateUserConfig(userConfig);
    let finalConfig;
    // If the user's config is currently valid before any defaults from the schema have been added,
    // then ensure that adding the defaults won't suddenly invalidate the schema.
    // Else, if the user's config is currently invalid, then try adding the defaults and check if that makes it valid.
    if (userConfigValid) {
        finalConfig = (0, json_1.klona)(userConfig);
        for (const key in defaultConfig) {
            /* istanbul ignore if */
            if (!{}.hasOwnProperty.call(defaultConfig, key)) {
                continue;
            }
            const _foo = {};
            _foo[key] = defaultConfig[key];
            const _tempMerged = (0, extend_1.default)(true, _foo, (0, json_1.klona)(finalConfig));
            const result = validateUserConfig(_tempMerged);
            if (result) {
                finalConfig = _tempMerged;
            }
        }
    }
    else {
        finalConfig = (0, extend_1.default)(true, defaultConfig, userConfig);
    }
    const result = validateUserConfig(finalConfig);
    if (result) {
        return finalConfig;
    }
    throw new Error(`Config for bundle "${bundleName}" is invalid:\n${(0, compileJsonSchema_1.formatJsonSchemaErrors)(schema, validateUserConfig.errors)}`);
}
function parseDefaults(bundleName, bundleDir) {
    const cfgSchemaPath = path.resolve(bundleDir, "configschema.json");
    if (fs.existsSync(cfgSchemaPath)) {
        const schema = _parseSchema(bundleName, cfgSchemaPath);
        return (0, compileJsonSchema_1.getSchemaDefault)(schema, bundleName);
    }
    return {};
}
function _parseSchema(bundleName, schemaPath) {
    try {
        return JSON.parse(fs.readFileSync(schemaPath, { encoding: "utf8" }));
    }
    catch (_) {
        throw new Error(`configschema.json for bundle "${bundleName}" could not be read. Ensure that it is valid JSON.`);
    }
}
//# sourceMappingURL=config.js.map