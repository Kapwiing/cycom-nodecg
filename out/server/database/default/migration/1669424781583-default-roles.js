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
exports.defaultRoles1669424781583 = void 0;
const ROLE_ID = "07e18d80-fa74-4d98-ac18-838c745a480f";
const PERMISSION_ID = "923561ef-4186-4370-b7df-f12e64fc7bd2";
class defaultRoles1669424781583 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`INSERT INTO role (id, name) VALUES ('${ROLE_ID}', 'superuser');`);
            yield queryRunner.query(`INSERT INTO permission (name, id, roleId, entityId, actions) VALUES ('superuser', '${PERMISSION_ID}', '${ROLE_ID}', '*', ${1 /* Action.READ */ | 2 /* Action.WRITE */});`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DELETE FROM role WHERE id='$1'`, [ROLE_ID]);
            yield queryRunner.query(`DELETE FROM permission WHERE id='$1'`, [
                PERMISSION_ID,
            ]);
        });
    }
}
exports.defaultRoles1669424781583 = defaultRoles1669424781583;
//# sourceMappingURL=1669424781583-default-roles.js.map