"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConcreteProperty = exports.getConcreteProperty = exports.FilterSettings = void 0;
class FilterSettings {
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
                "cloudProvider": [
                    { option: "Azure", enable: true },
                    { option: "AWS", enable: true },
                    { option: "GCP", enable: true },
                    { option: "Github", enable: true }
                ]
            }
        };
    }
    getAllSettings() {
        return this.settings;
    }
}
exports.FilterSettings = FilterSettings;
//Gets type and property. returns concrete property array of concrete type property in this.settings property
function getConcreteProperty(type, prop, settings) {
    const concreteType = type;
    const tempTypeObj = settings[concreteType];
    const concreteProperty = prop;
    return tempTypeObj[concreteProperty];
}
exports.getConcreteProperty = getConcreteProperty;
//Gets type and property. uses getConcreteProperty() function, set the returned value and returns it.
function setConcreteProperty(type, prop, settings, concretePrOPSettings) {
    let temp = getConcreteProperty(type, prop, settings);
    temp = concretePrOPSettings;
    return settings;
}
exports.setConcreteProperty = setConcreteProperty;
//# sourceMappingURL=filtering.js.map