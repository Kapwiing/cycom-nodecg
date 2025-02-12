import type { ApiKey as ApiKeyModel } from "../../../../types/models";
import { User } from "./User";
export declare class ApiKey implements ApiKeyModel {
    secret_key: string;
    user: User;
}
