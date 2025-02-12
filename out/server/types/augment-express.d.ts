import { DatabaseAdapter } from "../../types/database-adapter";
declare global {
    namespace Express {
        interface Locals {
            databaseAdapter: DatabaseAdapter;
        }
    }
}
