export class Assessments {
    public name: string = '';
    public properties: {
        displayName: string,
        status: {
            code: string
        },
    }
        = {
            displayName: '', status: { code: '' }
        };
}