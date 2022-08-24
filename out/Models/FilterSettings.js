"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConcreteProperty = exports.getConcreteProperty = exports.FilterSettings = void 0;
class FilterSettings {
    constructor() {
        //NOTE: In case of changing _settings' value, restart filter configuration is required
        this._settings = {
            "recommendations": {
                "status": [
                    { option: "Healthy", enable: true },
                    { option: "Unhealthy", enable: true },
                    { option: "NotApplicable", enable: true },
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
    get settings() {
        return this._settings;
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
function updateConcreteProperty(type, prop, settings, propertyToUpdate, updatedProperty) {
    propertyToUpdate = updatedProperty;
}
exports.updateConcreteProperty = updateConcreteProperty;
//# sourceMappingURL=filterSettings.js.map