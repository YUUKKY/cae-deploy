import * as core from '@actions/core';

export class ActionInputs {
    private _projectID: string;
    private _ak: string;
    private _sk: string;
    private _environmentID: string;
    private _applicationID: string;
    private _componentID: string;
    private _imageAddress: string;
    private _regionID: string;
    private _componentVersion: string;

    constructor() {
        this._projectID = core.getInput('project-id');
        this._ak = core.getInput('ak');
        this._sk = core.getInput('sk');
        this._regionID = core.getInput("region-id")
        this._environmentID = core.getInput('environment-id');
        this._applicationID = core.getInput('application-id')
        this._componentID = core.getInput('component-id');
        this._imageAddress = core.getInput('image-address');
        this._componentVersion = core.getInput('component-version');
    }

    public get ProjectID() {
        return this._projectID;
    }

    public get AK() {
        return this._ak;
    }

    public get SK() {
        return this._sk;
    }

    public get EnvironmentID() {
        return this._environmentID;
    }

    public get ApplicationID() {
        return this._applicationID;
    }

    public get ComponentID() {
        return this._componentID;
    }

    public get ImageAddress() {
        return this._imageAddress;
    }

    public get ComponentVersion() {
        return this._componentVersion;
    }

    public get RegionID() {
        return this._regionID;
    }
}