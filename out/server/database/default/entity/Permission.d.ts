import type { Permission as PermissionModel } from "../../../../types/models";
import { Role } from "./Role";
export declare const enum Action {
    NONE = 0,
    READ = 1,
    WRITE = 2
}
export declare class Permission implements PermissionModel {
    id: string;
    name: string;
    role: Role;
    entityId: string;
    actions: number;
}
