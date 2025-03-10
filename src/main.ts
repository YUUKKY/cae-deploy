import {ActionInputs} from "./model/actionInput";
import {DeploymentFactory} from './service/DeploymentFactory';
import * as core from '@actions/core';

try {
    let actionInputs = new ActionInputs();
    let deployment = DeploymentFactory.getDeployment(actionInputs);

    core.info("start upgrading")
    deployment.Upgrade()
} catch (error) {
    core.setFailed((error as Error).message);
}