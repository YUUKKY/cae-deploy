"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionInputs = void 0;
const core = __importStar(require("@actions/core"));
class ActionInputs {
    constructor() {
        this._projectID = core.getInput('project-id');
        this._ak = core.getInput('ak');
        this._sk = core.getInput('sk');
        this._regionID = core.getInput("region-id");
        this._environmentID = core.getInput('environment-id');
        this._applicationID = core.getInput('application-id');
        this._componentID = core.getInput('component-id');
        this._imageAddress = core.getInput('image-address');
        this._componentVersion = core.getInput('component-version');
    }
    get ProjectID() {
        return this._projectID;
    }
    get AK() {
        return this._ak;
    }
    get SK() {
        return this._sk;
    }
    get EnvironmentID() {
        return this._environmentID;
    }
    get ApplicationID() {
        return this._applicationID;
    }
    get ComponentID() {
        return this._componentID;
    }
    get ImageAddress() {
        return this._imageAddress;
    }
    get ComponentVersion() {
        return this._componentVersion;
    }
    get RegionID() {
        return this._regionID;
    }
}
exports.ActionInputs = ActionInputs;
