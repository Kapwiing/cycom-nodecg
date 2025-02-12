import type { User as UserModel } from "../../../../types/models";
import { ApiKey } from "./ApiKey";
import { Identity } from "./Identity";
import { Role } from "./Role";
export declare class User implements UserModel {
    id: string;
    created_at: number;
    name: string;
    roles: Role[];
    identities: Identity[];
    apiKeys: ApiKey[];
}
