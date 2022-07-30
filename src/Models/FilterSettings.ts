export class FilterSettings {

    private settings: Map<string, Map<string, { "option": string, "enable": boolean }[]>>;

    constructor() {
        this.settings = new Map<string, Map<string, { "option": string, "enable": boolean }[]>>(
            [
                [
                    "recommendations",
                    new Map<string, { "option": string, "enable": boolean }[]>([
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
                    new Map<string, { "option": string, "enable": boolean }[]>(
                        [
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
                    new Map<string, { "option": string, "enable": boolean }[]>(
                        [
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

    public getSettings(){
        return this.settings;
    }

    public getType(type:string){
         return this.getSettings().get(type);
    }
}
