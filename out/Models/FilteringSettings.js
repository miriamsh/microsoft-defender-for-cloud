"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterSettings = void 0;
class FilterSettings {
    constructor() {
        this.recommendations = new Map([
            ["severity",
                [
                    { option: "High", enable: true },
                    { option: "Medium", enable: true },
                    { option: "Low", enable: true }
                ]
            ],
            ["status",
                [
                    { option: "Completed", enable: true },
                    { option: "Uncompleted", enable: true }
                ]
            ],
            ["environment",
                [
                    { option: "Azure", enable: true },
                    { option: "AWS", enable: true },
                    { option: "GCP", enable: true }
                ]
            ]
        ]);
        this.alerts = new Map([
            ["severity",
                [
                    { option: "High", enable: true },
                    { option: "Medium", enable: true },
                    { option: "Low", enable: true }
                ]
            ],
            ["status",
                [
                    { option: "Completed", enable: true },
                    { option: "Uncompleted", enable: true }
                ]
            ]
        ]);
        this.connectors = new Map([
            ["cloud ",
                [
                    { option: "cloud explorer_1", enable: true }
                ]
            ]
        ]);
    }
}
exports.FilterSettings = FilterSettings;
//# sourceMappingURL=FilteringSettings.js.map