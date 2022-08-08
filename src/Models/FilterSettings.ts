import { Categories } from "@azure/arm-security";
import { objectValues } from "@azure/ms-rest-js/es/lib/util/utils";

export class FilterSettings {

    private settings;

    constructor() {
        this.settings = {
            "recommendations": {
                "status": [
                    { option: "Healthy", enable: true },
                    { option: "Unhealthy", enable: true },
                    { option: "NotApplicable", enable: true }
                ],
                "environment": [{ option: "Azure", enable: true },
                    { option: "AWS", enable: true },
                    { option: "GCP", enable: true }
                ]
            },
            "alerts": {
                "status": [
                    { option: "High", enable: true },
                    { option: "Medium", enable: true },
                    { option: "Low", enable: true }
                ],
                "severity": [
                    { option: "Healthy", enable: true },
                    { option: "Unhealthy", enable: true },
                    { option: "NotApplicable", enable: true }
                ]
            },
            "connectors": {
                "cloudExplorer": [
                    { option: "cloud explorer_1", enable: true }
                ]
            }
        };
    }

    public getAllSettings() {
        return this.settings;
    }

}

//Gets type and property. returns concrete property array of concrete type property in this.settings property
export function getConcreteProperty(type: string, prop: string, settings: any): { option: string; enable: boolean; }[] {
    type ObjSettings = keyof typeof settings;
    const concreteType = type as ObjSettings;
    const tempTypeObj = settings[concreteType];
    type ObjType = keyof typeof tempTypeObj;
    const concreteProperty = prop as ObjType;
    return tempTypeObj[concreteProperty];
}

//Gets type and property. uses getConcreteProperty() function, set the returned value and returns it.
export function setConcreteProperty(type: string, prop: string, settings: any, concretePrOPSettings: { option: string; enable: boolean; }[]) {
    let temp = getConcreteProperty(type, prop, settings);
    temp = concretePrOPSettings;
    return settings;
}
