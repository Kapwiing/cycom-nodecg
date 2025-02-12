"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketAuthMiddleware = void 0;
const serialize_error_1 = require("serialize-error");
const socket_protocol_1 = require("../../types/socket-protocol");
const config_1 = require("../config");
const logger_1 = require("../logger");
const UnauthorizedError_1 = require("../login/UnauthorizedError");
const log = (0, logger_1.createLogger)("socket-auth");
const socketsByKey = new Map();
const createSocketAuthMiddleware = (db) => {
    return function socketAuthMiddleware(socket, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { token } = socket.handshake.query;
                if (!token) {
                    next(new UnauthorizedError_1.UnauthorizedError(socket_protocol_1.UnAuthErrCode.InvalidToken, "no token provided"));
                    return;
                }
                if (Array.isArray(token)) {
                    next(new UnauthorizedError_1.UnauthorizedError(socket_protocol_1.UnAuthErrCode.InvalidToken, "more than one token provided"));
                    return;
                }
                const apiKey = yield db.findApiKey(token);
                if (!apiKey) {
                    next(new UnauthorizedError_1.UnauthorizedError(socket_protocol_1.UnAuthErrCode.CredentialsRequired, "no credentials found"));
                    return;
                }
                const user = yield db.findUser(apiKey.user.id);
                if (!user) {
                    next(new UnauthorizedError_1.UnauthorizedError(socket_protocol_1.UnAuthErrCode.CredentialsRequired, "no user associated with provided credentials"));
                    return;
                }
                // But only authed sockets can join the Authed room.
                const provider = user.identities[0].provider_type;
                const providerAllowed = config_1.config.login.enabled && ((_b = (_a = config_1.config.login) === null || _a === void 0 ? void 0 : _a[provider]) === null || _b === void 0 ? void 0 : _b.enabled);
                const allowed = db.isSuperUser(user) && providerAllowed;
                if (allowed) {
                    if (!socketsByKey.has(token)) {
                        socketsByKey.set(token, new Set());
                    }
                    const socketSet = socketsByKey.get(token);
                    /* istanbul ignore next: should be impossible */
                    if (!socketSet) {
                        throw new Error("socketSet was somehow falsey");
                    }
                    socketSet.add(socket);
                    socket.on("regenerateToken", (cb) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            // Lookup the ApiKey for this token we want to revoke.
                            const keyToDelete = yield db.findApiKey(token);
                            // If there's a User associated to this key (there should be)
                            // give them a new ApiKey
                            if (keyToDelete) {
                                // Make the new api key
                                const newApiKey = yield db.createApiKey();
                                // Remove the old key from the user, replace it with the new
                                const user = yield db.findUser(keyToDelete.user.id);
                                if (!user) {
                                    throw new Error("should have been a user here");
                                }
                                user.apiKeys = user.apiKeys.filter((ak) => ak.secret_key !== token);
                                user.apiKeys.push(newApiKey);
                                yield db.saveUser(user);
                                // Delete the old key entirely
                                yield db.deleteSecretKey(token);
                                if (cb) {
                                    cb(undefined, undefined);
                                }
                            }
                            else {
                                // Something is weird if we're here, just close the socket.
                                if (cb) {
                                    cb(undefined, undefined);
                                }
                                socket.disconnect(true);
                            }
                            // Close all sockets that are using the invalidated key,
                            // EXCEPT the one that requested the revocation.
                            // If we close the one that requested the revocation,
                            // there will be a race condition where it might get redirected
                            // to an error page before it receives the new key.
                            for (const s of socketSet) {
                                if (s === socket) {
                                    continue;
                                }
                                s.emit("protocol_error", new UnauthorizedError_1.UnauthorizedError(socket_protocol_1.UnAuthErrCode.TokenRevoked, "This token has been invalidated").serialized);
                                // We need to wait a bit before disconnecting the socket,
                                // because we need to give them time to receive the "error"
                                // message we just sent.
                                setTimeout(() => {
                                    s.disconnect(true);
                                }, 500);
                            }
                            socketsByKey.delete(token);
                        }
                        catch (error) {
                            log.error((0, serialize_error_1.serializeError)(error));
                            if (cb) {
                                cb(error, undefined);
                            }
                        }
                    }));
                    // Don't leak memory by retaining references to all sockets indefinitely
                    socket.on("disconnect", () => {
                        socketSet.delete(socket);
                    });
                }
                if (allowed) {
                    next(undefined);
                }
                else {
                    next(new UnauthorizedError_1.UnauthorizedError(socket_protocol_1.UnAuthErrCode.InvalidToken, "user is not allowed"));
                }
            }
            catch (error) {
                next(error);
            }
        });
    };
};
exports.createSocketAuthMiddleware = createSocketAuthMiddleware;
//# sourceMappingURL=socketAuthMiddleware.js.map