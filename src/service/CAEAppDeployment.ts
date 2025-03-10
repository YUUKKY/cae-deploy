import * as core from '@actions/core';
import * as HuaweiIAM from '@huaweicloud/huaweicloud-sdk-core';
import * as HuaweiCAE from '@huaweicloud/huaweicloud-sdk-cae/v1/public-api';
import {BaseAppDeployment} from './BaseAppDeployment';
import {ActionInputs} from "../model/ActionInput";
import {CaeClient} from "@huaweicloud/huaweicloud-sdk-cae/v1/CaeClient";
import {ICredential} from "@huaweicloud/huaweicloud-sdk-core/auth/ICredential";
import {ExecuteActionRequest} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/ExecuteActionRequest";
import {ExecuteActionRequestBody} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/ExecuteActionRequestBody";
import {ApiVersionObj} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/ApiVersionObj";
import {ShowJobRequest} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/ShowJobRequest";
import {JobSpec} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/JobSpec";
import {ShowJobResponse} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/ShowJobResponse";
import {Task} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/Task";
import {
    ExecuteActionRequestBodyMetadata, ExecuteActionRequestBodyMetadataNameEnum
} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/ExecuteActionRequestBodyMetadata";
import {ShowComponentRequest} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/ShowComponentRequest";
import {
    ActionOnComponentSource,
    ActionOnComponentSourceTypeEnum
} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/ActionOnComponentSource";
import {ActionOnComponentSpec} from "@huaweicloud/huaweicloud-sdk-cae/v1/model/ActionOnComponentSpec";

export class CAEAppDeployment implements BaseAppDeployment {
    protected actionInputs: ActionInputs;
    protected credential: ICredential;
    protected caeClient: CaeClient;
    protected errorDetail: string;

    constructor(inputs: ActionInputs) {
        this.actionInputs = inputs;
        this.credential = new HuaweiIAM.BasicCredentials()
            .withAk(this.actionInputs.AK)
            .withSk(this.actionInputs.SK)
            .withProjectId(this.actionInputs.ProjectID)
        this.caeClient = HuaweiCAE.CaeClient.newBuilder()
            .withCredential(this.credential)
            .withEndpoint("https://cae." + this.actionInputs.RegionID + ".myhuaweicloud.com")
            .build();
        this.errorDetail = "";
    }

    public async Upgrade(): Promise<void> {
        const body = new HuaweiCAE.ExecuteActionRequestBody()
            .withMetadata(new HuaweiCAE.ExecuteActionRequestBodyMetadata(HuaweiCAE.ExecuteActionRequestBodyMetadataNameEnum.UPGRADE)
                .withAnnotations({["version"]: this.actionInputs.ComponentVersion}))
            .withKind("Action")
            .withApiVersion("v1")
            .withSpec(new HuaweiCAE.ActionOnComponentSpec()
                .withSource(new HuaweiCAE.ActionOnComponentSource()
                    .withType(HuaweiCAE.ActionOnComponentSourceTypeEnum.IMAGE)
                    .withUrl(this.actionInputs.ImageAddress)));

        const upgradeReq = new HuaweiCAE.ExecuteActionRequest(
            this.actionInputs.ApplicationID,
            this.actionInputs.ComponentID,
            this.actionInputs.EnvironmentID
        ).withBody(body);

        let result = await this.caeClient.executeAction(upgradeReq);
        let jobID = result.jobId;
        if (jobID === undefined) {
            console.log(result)
            throw new Error("job id could not be found");
        } else {
            this.checkJobStatus(jobID).then(result => {
                core.info(result);
            }).catch(error => {
                core.error(error.message);
            });
        }
    }

    private async checkJobStatus(jobID: string): Promise<string> {
        const timeoutMs = 5 * 60 * 1000; // 5分钟超时
        const intervalMs = 5000; // 每5秒检查一次
        const startTime = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            const status = await this.getJobResult(jobID);
            if (status === "success") {
                return status;
            } else if (status === "failed" || status === "timeout") {
                throw new Error(this.errorDetail);
            }
            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }

        throw new Error("Job Status time out");
    }


    private async getJobResult(jobID: string): Promise<string> {
        const request = new HuaweiCAE.ShowJobRequest(jobID, this.actionInputs.EnvironmentID);
        let jobInfo = await this.caeClient.showJob(request);
        if (!jobInfo.spec || !jobInfo.spec.status) {
            throw new Error("job info could not be found");
        }
        this.getJobError(jobInfo);
        return jobInfo.spec.status;
    }

    private getJobError(jobInfo: HuaweiCAE.ShowJobResponse) {
        if (jobInfo.spec?.tasks) {
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