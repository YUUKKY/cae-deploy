"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentFactory = void 0;
const CAEAppDeployment_1 = require("./CAEAppDeployment");
class DeploymentFactory {
    static getDeployment(inputs) {
        return new CAEAppDeployment_1.CAEAppDeployment(inputs);
    }
}
exports.DeploymentFactory = DeploymentFactory;
