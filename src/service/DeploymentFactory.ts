import {BaseAppDeployment} from "./BaseAppDeployment";
import {CAEAppDeployment} from "./CAEAppDeployment";
import {ActionInputs} from "../model/actionInput";

export class DeploymentFactory {

    public static getDeployment(inputs: ActionInputs) : BaseAppDeployment {
        return new CAEAppDeployment(inputs);
    }
}