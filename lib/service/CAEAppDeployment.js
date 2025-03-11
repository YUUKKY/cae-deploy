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
exports.CAEAppDeployment = void 0;
const core = __importStar(require("@actions/core"));
const HuaweiIAM = __importStar(require("@huaweicloud/huaweicloud-sdk-core"));
const HuaweiCAE = __importStar(require("@huaweicloud/huaweicloud-sdk-cae/v1/public-api"));
class CAEAppDeployment {
    constructor(inputs) {
        this.actionInputs = inputs;
        this.credential = new HuaweiIAM.BasicCredentials()
            .withAk(this.actionInputs.AK)
            .withSk(this.actionInputs.SK)
            .withProjectId(this.actionInputs.ProjectID);
        this.caeClient = HuaweiCAE.CaeClient.newBuilder()
            .withCredential(this.credential)
            .withEndpoint("https://cae." + this.actionInputs.RegionID + ".myhuaweicloud.com")
            .build();
        this.errorDetail = "";
    }
    Upgrade() {
        return __awaiter(this, void 0, void 0, function* () {
            const body = new HuaweiCAE.ExecuteActionRequestBody()
                .withMetadata(new HuaweiCAE.ExecuteActionRequestBodyMetadata(HuaweiCAE.ExecuteActionRequestBodyMetadataNameEnum.UPGRADE)
                .withAnnotations({ ["version"]: this.actionInputs.ComponentVersion }))
                .withKind("Action")
                .withApiVersion("v1")
                .withSpec(new HuaweiCAE.ActionOnComponentSpec()
                .withSource(new HuaweiCAE.ActionOnComponentSource()
                .withType(HuaweiCAE.ActionOnComponentSourceTypeEnum.IMAGE)
                .withUrl(this.actionInputs.ImageAddress)));
            const upgradeReq = new HuaweiCAE.ExecuteActionRequest(this.actionInputs.ApplicationID, this.actionInputs.ComponentID, this.actionInputs.EnvironmentID).withBody(body);
            this.caeClient.executeAction(upgradeReq).then(result => {
                console.log("before func" + JSON.stringify(result));
                setTimeout(() => {
                    console.log("in func" + JSON.stringify(result));
                    if (result.jobId === undefined) {
                        console.log(result);
                        console.log("test" + JSON.stringify(result));
                        throw new Error("job id could not be found");
                    }
                    else {
                        this.checkJobStatus(result.jobId).then(result => {
                            core.info(result);
                        }).catch(error => {
                            core.error(error.message);
                        });
                    }
                }, 5000);
            });
        });
    }
    checkJobStatus(jobID) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeoutMs = 5 * 60 * 1000; // 5分钟超时
            const intervalMs = 5000; // 每5秒检查一次
            const startTime = Date.now();
            while (Date.now() - startTime < timeoutMs) {
                const status = yield this.getJobResult(jobID);
                if (status === "success") {
                    return status;
                }
                else if (status === "failed" || status === "timeout") {
                    throw new Error(this.errorDetail);
                }
                yield new Promise(resolve => setTimeout(resolve, intervalMs));
            }
            throw new Error("Job Status time out");
        });
    }
    getJobResult(jobID) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = new HuaweiCAE.ShowJobRequest(jobID, this.actionInputs.EnvironmentID);
            let jobInfo = yield this.caeClient.showJob(request);
            if (!jobInfo.spec || !jobInfo.spec.status) {
                throw new Error("job info could not be found");
            }
            this.getJobError(jobInfo);
            return jobInfo.spec.status;
        });
    }
    getJobError(jobInfo) {
        var _a;
        if ((_a = jobInfo.spec) === null || _a === void 0 ? void 0 : _a.tasks) {
            jobInfo.spec.tasks.forEach((item, index) => {
                if (item.status === "failed") {
                    if (item.detail) {
                        this.errorDetail = item.detail;
                    }
                    return;
                }
            });
        }
    }
}
exports.CAEAppDeployment = CAEAppDeployment;
