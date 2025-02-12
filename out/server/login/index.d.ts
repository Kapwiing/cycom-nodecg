import express from "express";
import { DatabaseAdapter } from "../../types/database-adapter";
export declare function createMiddleware(db: DatabaseAdapter, callbacks: {
    onLogin(user: Express.User): void;
    onLogout(user: Express.User): void;
}): {
    app: import("express-serve-static-core").Express;
    sessionMiddleware: express.RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
};
