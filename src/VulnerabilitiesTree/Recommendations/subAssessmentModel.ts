export class SubAssessments {
    public name: string = '';
    public properties: {
        displayName: string,
        status: {
            code: string,
            severity: string
        },
        remediation: string,
        description: string
    }
        = {
            displayName: '', status: { code: '', severity: '' }, 
            remediation: '',
            description: ''
        };
}