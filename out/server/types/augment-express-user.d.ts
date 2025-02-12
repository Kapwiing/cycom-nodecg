import type { User as UserModel } from "../../types/models";
declare global {
    namespace Express {
        /**
         * This is the idiomatic, intended way of
         * adding one's User type to the Request object
         * when using Express with Passport.
         */
        interface User extends UserModel {
        }
    }
}
