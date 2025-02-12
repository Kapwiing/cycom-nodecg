import type { Role as RoleModel } from "../../../../types/models";
import { Permission } from "./Permission";
export declare class Role implements RoleModel {
    id: string;
    name: string;
    permissions: Permission[];
}
