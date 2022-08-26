
export class FilterSettings {

    private _settings;

    constructor() {

        //NOTE: In case of changing _settings' value, restart filter configuration is required

        this._settings = {
            "recommendations": {
                "status": [
                    { option: "Healthy", enable: true },
                    { option: "Unhealthy", enable: true },
                    { option: "NotApplicable", enable: true },
                ],
                "environment":
                    [{ option: "Azure", enable: true },
                    { option: "AWS", enable: true },
                    { option: "GCP", enable: true }
                    ]
            },
            "alerts": {
                "status":
                    [
                        { option: "Active", enable: true },
                        { option: "Dismissed", enable: true },
                        { option: "Resolved", enable: true }
                    ],
                "severity": [
                    { option: "High", enable: true },
                    { option: "Informational", enable: true },
                    { option: "Medium", enable: true },
                    { option: "Low", enable: true }
                ]
            },
            "connectors": {
                "cloudProvider": [
                    { option: "Azure", enable: true },
                    { option: "AWS", enable: true },
                    { option: "GCP", enable: true },
                    { option: "Github", enable: true }
                ]
            }
        };
    }

    public get settings() {
        return this._settings;
    }

    //TODO:Complete this function. gets settings obj, has to returns if the structure is equal to this.settings structure
    public static isInstance(previousSettings:any){
        //Be aware for nested objects
        for (const key of Object.keys(previousSettings)) {
            
        }
    }

}

export interface IFilterPropertyOption {
    option: string,
    enable: boolean
}

//Gets type and property. returns concrete property array of concrete type property in this.settings property
export function getConcreteProperty(type: string, prop: string, settings: any): IFilterPropertyOption[] {
    type ObjSettings = keyof typeof settings;
    const concreteType = type as ObjSettings;
    const tempTypeObj = settings[concreteType];
    type ObjType = keyof typeof tempTypeObj;
    const concreteProperty = prop as ObjType;
    return tempTypeObj[concreteProperty];
}

//Gets type and property. uses getConcreteProperty() function, set the returned value and returns it.
export function updateConcreteProperty(type: string, prop: string, settings: any, propertyToUpdate: IFilterPropertyOption[], updatedProperty: IFilterPropertyOption[]) {
    propertyToUpdate = updatedProperty;
}
