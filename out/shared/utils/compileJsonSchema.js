"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileJsonSchema = compileJsonSchema;
exports.formatJsonSchemaErrors = formatJsonSchemaErrors;
exports.getSchemaDefault = getSchemaDefault;
const json_schema_defaults_1 = __importDefault(require("@nodecg/json-schema-defaults"));
const ajv_1 = __importDefault(require("ajv"));
const _2019_1 = __importDefault(require("ajv/dist/2019"));
const _2020_1 = __importDefault(require("ajv/dist/2020"));
const ajv_draft_04_1 = __importDefault(require("ajv-draft-04"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const errors_1 = require("./errors");
const options = {
    allErrors: true,
    verbose: true,
    strict: "log",
};
const ajv = {
    draft04: (0, ajv_formats_1.default)(new ajv_draft_04_1.default(options)),
    draft07: (0, ajv_formats_1.default)(new ajv_1.default(options)),
    "draft2019-09": (0, ajv_formats_1.default)(new _2019_1.default(options)),
    "draft2020-12": (0, ajv_formats_1.default)(new _2020_1.default(options)),
};
function compileJsonSchema(schema) {
    const schemaVersion = extractSchemaVersion(schema);
    if (schemaVersion.includes("draft-04")) {
        return ajv.draft04.compile(schema);
    }
    if (schemaVersion.includes("draft-07")) {
        return ajv.draft07.compile(schema);
    }
    if (schemaVersion.includes("draft/2019-09")) {
        return ajv["draft2019-09"].compile(schema);
    }
    if (schemaVersion.includes("draft/2020-12")) {
        return ajv["draft2020-12"].compile(schema);
    }
    throw new Error(`Unsupported JSON Schema version "${schemaVersion}"`);
}
function formatJsonSchemaErrors(schema, errors) {
    const schemaVersion = extractSchemaVersion(schema);
    if (schemaVersion.includes("draft-04")) {
        return ajv.draft04.errorsText(errors).replace(/^data\//gm, "");
    }
    if (schemaVersion.includes("draft-07")) {
        return ajv.draft07.errorsText(errors).replace(/^data\//gm, "");
    }
    if (schemaVersion.includes("draft/2019-09")) {
        return ajv["draft2019-09"].errorsText(errors).replace(/^data\//gm, "");
    }
    if (schemaVersion.includes("draft/2020-12")) {
        return ajv["draft2020-12"].errorsText(errors).replace(/^data\//gm, "");
    }
    throw new Error(`Unsupported JSON Schema version "${schemaVersion}"`);
}
function getSchemaDefault(schema, labelForDebugging) {
    try {
        return (0, json_schema_defaults_1.default)(schema);
    }
    catch (error) {
        throw new Error(`Error generating default value(s) for schema "${labelForDebugging}":\n\t${(0, errors_1.stringifyError)(error)}`);
    }
}
function extractSchemaVersion(schema) {
    // For backwards compat, we default to draft-04.
    const defaultVersion = "https://json-schema.org/draft-04/schema";
    const extractedVersion = schema["$schema"];
    return typeof extractedVersion === "string"
        ? extractedVersion
        : defaultVersion;
}
//# sourceMappingURL=compileJsonSchema.js.map