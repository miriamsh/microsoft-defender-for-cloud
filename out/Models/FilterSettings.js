"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterSettings = void 0;
class FilterSettings {
    constructor() {
        this.settings = new Map([
            [
                "recommendations",
                new Map([
                    [
                        "status",
                        [
                            { option: "Healthy", enable: true },
                            { option: "Unhealthy", enable: true },
                            { option: "NotApplicable", enable: true }
                        ]
                    ],
                    [
                        "environment",
                        [
                            { option: "Azure", enable: true },
                            { option: "AWS", enable: true },
                            { option: "GCP", enable: true }
                        ]
                    ]
                ])
            ],
            [
                "alerts",
                new Map([
                    [
                        "severity",
                        [
                            { option: "High", enable: true },
                            { option: "Medium", enable: true },
                            { option: "Low", enable: true }
                        ]
                    ],
                    [
                        "status",
                        [
                            { option: "Completed", enable: true },
                            { option: "Uncompleted", enable: true },
                            { option: "NotApplicable", enable: true }
                        ]
                    ]
                ])
            ],
            [
                "connectors",
                new Map([
                    [
                        "cloudExplorer",
                        [
                            { option: "cloud explorer_1", enable: true }
                        ]
                    ]
                ])
            ]
        ]);
    }
    getSettings() {
        return this.settings;
    }
    getType(type) {
        return this.getSettings().get(type);
    }
}
exports.FilterSettings = FilterSettings;
//# sourceMappingURL=FilterSettings.js.map