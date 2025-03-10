import {BaseAppDeployment} from "./BaseAppDeployment";
import {CAEAppDeployment} from "./CAEAppDeployment";
import {ActionInputs} from "../model/ActionInput";

export class DeploymentFactory {

    public static getDeployment(inputs: ActionInputs) : BaseAppDeployment {
        return new CAEAppDeployment(inputs);
    }
}