export class Alerts {
    public name: string = '';
    public properties: {
        status: string,
        severity: string,
        compromisedEntity: string,
        alertDisplayName: string
        description: string,
    } = { status: '', severity: '', compromisedEntity: '', alertDisplayName: '', description: '' };
}