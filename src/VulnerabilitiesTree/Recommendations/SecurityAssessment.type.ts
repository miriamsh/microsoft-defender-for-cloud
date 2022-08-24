export type SecurityAssessment = {
    displayName: string,
    id: string,
    name: string,
    resourceDetails:
    {
        Source: string,
        Id: string
    },
    status:
    {
        code: 'Healthy' | 'Unhealthy' | 'NotApplicable',
        firstEvaluationDate: Date
    },
    type: string
};