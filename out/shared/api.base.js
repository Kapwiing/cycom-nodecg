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
exports.NodeCGAPIBase = void 0;
const { version } = require("../../package.json");
const typed_emitter_1 = require("./typed-emitter");
class NodeCGAPIBase extends typed_emitter_1.TypedEmitter {
    /**
     * Lets you easily wait for a group of Replicants to finish declaring.
     *
     * Returns a promise which is resolved once all provided Replicants
     * have emitted a `change` event, which is indicates that they must
     * have finished declaring.
     *
     * This method is only useful in client-side code.
     * Server-side code never has to wait for Replicants.
     *
     * @param replicants {Replicant}
     * @returns {Promise<any>}
     *
     * @example <caption>From a graphic or dashboard panel:</caption>
     * const rep1 = nodecg.Replicant('rep1');
     * const rep2 = nodecg.Replicant('rep2');
     *
     * // You can provide as many Replicant arguments as you want,
     * // this example just uses two Replicants.
     * NodeCG.waitForReplicants(rep1, rep2).then(() => {
     *     console.log('rep1 and rep2 are fully declared and ready to use!');
     * });
     */
    static waitForReplicants(...replicants) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const numReplicants = replicants.length;
                let declaredReplicants = 0;
                replicants.forEach((replicant) => {
                    replicant.once("change", () => {
                        declaredReplicants++;
                        if (declaredReplicants >= numReplicants) {
                            resolve();
                        }
                    });
                });
            });
        });
    }
    constructor(bundle) {
        super();
        this._messageHandlers = [];
        this.bundleName = bundle.name;
        this.bundleConfig = bundle.config;
        this.bundleVersion = bundle.version;
        this.bundleGit = bundle.git;
    }
    listenFor(messageName, bundleNameOrHandlerFunc, handlerFunc) {
        let bundleName;
        if (typeof bundleNameOrHandlerFunc === "string") {
            bundleName = bundleNameOrHandlerFunc;
        }
        else {
            bundleName = this.bundleName;
            handlerFunc = bundleNameOrHandlerFunc;
        }
        if (typeof handlerFunc !== "function") {
            throw new Error(`argument "handler" must be a function, but you provided a(n) ${typeof handlerFunc}`);
        }
        this.log.trace("Listening for %s from bundle %s", messageName, bundleNameOrHandlerFunc);
        this._messageHandlers.push({
            messageName,
            bundleName,
            func: handlerFunc,
        });
    }
    unlisten(messageName, bundleNameOrHandler, maybeHandler) {
        let { bundleName } = this;
        let handlerFunc = maybeHandler;
        if (typeof bundleNameOrHandler === "string") {
            bundleName = bundleNameOrHandler;
        }
        else {
            handlerFunc = bundleNameOrHandler;
        }
        if (typeof handlerFunc !== "function") {
            throw new Error(`argument "handler" must be a function, but you provided a(n) ${typeof handlerFunc}`);
        }
        this.log.trace("[%s] Removing listener for %s from bundle %s", this.bundleName, messageName, bundleName);
        // Find the index of this handler in the array.
        const index = this._messageHandlers.findIndex((handler) => handler.messageName === messageName &&
            handler.bundleName === bundleName &&
            handler.func === handlerFunc);
        // If the handler exists, remove it and return true.
        if (index >= 0) {
            this._messageHandlers.splice(index, 1);
            return true;
        }
        // Else, return false.
        return false;
    }
    Replicant(name, namespaceOrOpts, opts) {
        let namespace;
        if (typeof namespaceOrOpts === "string") {
            namespace = namespaceOrOpts;
        }
        else {
            namespace = this.bundleName;
        }
        if (typeof namespaceOrOpts !== "string") {
            opts = namespaceOrOpts;
        }
        const defaultOpts = {};
        opts = opts !== null && opts !== void 0 ? opts : defaultOpts;
        return this._replicantFactory(name, namespace, opts);
    }
}
exports.NodeCGAPIBase = NodeCGAPIBase;
NodeCGAPIBase.version = version;
//# sourceMappingURL=api.base.js.map