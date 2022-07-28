export class FilterSettings {

    public recommendations: Map<string, { "option": string, "enable": boolean }[]>;
    public alerts!: Map<string, { "option": string, "enable": boolean }[]>;
    public connectors!: Map<string, { "option": string, "enable": boolean }[]>;

    constructor() {
        this.recommendations = new Map<string, { "option": string, "enable": boolean }[]>(
            [
                ["status",
                    [
                        { option: "Healthy", enable: true },
                        { option: "Unhealthy", enable: true },
                        { option: "NotApplicable", enable: true }
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
        this.alerts = new Map<string, { "option": string, "enable": boolean }[]>(
            [
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
                        { option: "Uncompleted", enable: true },
                        { option: "NotApplicable", enable: true }
                    ]
                ]
            ]);
        this.connectors = new Map<string, { "option": string, "enable": boolean }[]>(
            [
                ["cloud ",
                    [
                        { option: "cloud explorer_1", enable: true }
                    ]
                ]
            ]);
    }
}