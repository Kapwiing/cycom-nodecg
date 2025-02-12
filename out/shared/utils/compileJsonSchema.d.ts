import { type ErrorObject, type ValidateFunction } from "ajv";
export declare function compileJsonSchema(schema: Record<any, unknown>): ValidateFunction;
export declare function formatJsonSchemaErrors(schema: Record<any, unknown>, errors?: ErrorObject[] | null): string;
export declare function getSchemaDefault(schema: Record<any, unknown>, labelForDebugging: string): unknown;
