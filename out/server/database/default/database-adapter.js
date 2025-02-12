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
exports.defaultAdapter = void 0;
const connection_1 = require("./connection");
function findUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, connection_1.getConnection)();
        return database.getRepository(connection_1.User).findOne({
            where: { id },
            relations: ["roles", "identities", "apiKeys"],
            cache: true,
        });
    });
}
function getSuperUserRole() {
    return __awaiter(this, void 0, void 0, function* () {
        const superUserRole = yield findRole("superuser");
        if (!superUserRole) {
            throw new Error("superuser role unexpectedly not found");
        }
        return superUserRole;
    });
}
function upsertUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, provider_type, provider_hash, provider_access_token, provider_refresh_token, roles, }) {
        const database = yield (0, connection_1.getConnection)();
        const { manager } = database;
        let user = null;
        // Check for ident that matches.
        // If found, it should have an associated user, so return that.
        // Else, make an ident and user.
        const existingIdent = yield findIdent(provider_type, provider_hash);
        if (existingIdent) {
            existingIdent.provider_access_token = provider_access_token !== null && provider_access_token !== void 0 ? provider_access_token : null;
            existingIdent.provider_refresh_token = provider_refresh_token !== null && provider_refresh_token !== void 0 ? provider_refresh_token : null;
            yield manager.save(existingIdent);
            user = yield findUserById(existingIdent.user.id);
        }
        else {
            const ident = yield createIdentity({
                provider_type,
                provider_hash,
                provider_access_token: provider_access_token !== null && provider_access_token !== void 0 ? provider_access_token : null,
                provider_refresh_token: provider_refresh_token !== null && provider_refresh_token !== void 0 ? provider_refresh_token : null,
            });
            const apiKey = yield createApiKey();
            user = manager.create(connection_1.User, {
                name,
                identities: [ident],
                apiKeys: [apiKey],
            });
        }
        if (!user) {
            // Something went very wrong.
            throw new Error("Failed to find user after upserting.");
        }
        // Always update the roles, regardless of if we are making a new user or updating an existing one.
        user.roles = roles;
        return manager.save(user);
    });
}
function isSuperUser(user) {
    var _a;
    return Boolean((_a = user.roles) === null || _a === void 0 ? void 0 : _a.find((role) => role.name === "superuser"));
}
function findRole(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, connection_1.getConnection)();
        const { manager } = database;
        return manager.findOne(connection_1.Role, { where: { name }, relations: ["permissions"] });
    });
}
function createIdentity(identInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, connection_1.getConnection)();
        const { manager } = database;
        // See https://github.com/typeorm/typeorm/issues/9070
        const ident = manager.create(connection_1.Identity, identInfo);
        return manager.save(ident);
    });
}
function createApiKey() {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, connection_1.getConnection)();
        const { manager } = database;
        const apiKey = manager.create(connection_1.ApiKey);
        yield manager.save(apiKey);
        return apiKey;
    });
}
function findIdent(type, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, connection_1.getConnection)();
        return database.getRepository(connection_1.Identity).findOne({
            where: { provider_hash: hash, provider_type: type },
            relations: ["user"],
        });
    });
}
function findUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, connection_1.getConnection)();
        return database.getRepository(connection_1.User).findOne({
            where: {
                id: userId,
            },
            relations: ["roles", "identities", "apiKeys"],
        });
    });
}
function findApiKey(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, connection_1.getConnection)();
        return database.getRepository(connection_1.ApiKey).findOne({
            where: { secret_key: token },
            relations: ["user"],
        });
    });
}
function saveUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, connection_1.getConnection)();
        yield database.manager.save(user);
    });
}
function deleteSecretKey(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, connection_1.getConnection)();
        yield database.manager.delete(connection_1.ApiKey, { secret_key: token });
    });
}
const repEntities = [];
function saveReplicant(replicant) {
    return __awaiter(this, void 0, void 0, function* () {
        let valueChangedDuringSave = false;
        const connection = yield (0, connection_1.getConnection)();
        const manager = connection.manager;
        let repEnt;
        const existingEnt = repEntities.find((pv) => pv.namespace === replicant.namespace && pv.name === replicant.name);
        if (existingEnt) {
            repEnt = existingEnt;
        }
        else {
            repEnt = manager.create(connection_1.Replicant, {
                namespace: replicant.namespace,
                name: replicant.name,
            });
            repEntities.push(repEnt);
        }
        const valueRef = replicant.value;
        let serializedValue = JSON.stringify(valueRef);
        if (typeof serializedValue === "undefined") {
            serializedValue = "";
        }
        const changeHandler = (newVal) => {
            if (newVal !== valueRef && !isNaN(valueRef)) {
                valueChangedDuringSave = true;
            }
        };
        repEnt.value = serializedValue;
        try {
            replicant.on("change", changeHandler);
            yield manager.save(repEnt);
            if (!valueChangedDuringSave) {
                return;
            }
            // If we are here, then that means the value changed again during
            // the save operation, and so we have to do some recursion
            // to save it again.
            yield saveReplicant(replicant);
        }
        finally {
            replicant.off("change", changeHandler);
        }
    });
}
function getAllReplicants() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, connection_1.getConnection)();
        return connection.getRepository(connection_1.Replicant).find();
    });
}
exports.defaultAdapter = {
    findUser,
    getSuperUserRole,
    upsertUser,
    isSuperUser,
    createApiKey,
    findApiKey,
    saveUser,
    deleteSecretKey,
    saveReplicant,
    getAllReplicants,
};
//# sourceMappingURL=database-adapter.js.map