import axios from 'axios';
import * as vscode from 'vscode';
import { PDF } from '../Document/PDF';


export async function createReport(context: vscode.ExtensionContext, node: any) {
    const path = context.extensionPath + '\\mdc_report.pdf';
    try {

        const res = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
        }, async (progress) => {
            progress.report({
                message: `Creating report ...`,
            });
            return await axios.post('https://mdc-report-function.azurewebsites.net/api/report-function?',
                {
                    token: await node.subscription.credentials.getToken(),
                    url: node.apiUrl,
                    filterSettings: node.filter
                }
            );
        });

        if (res.data.length > 0) {
            const document = new PDF(path, node.model);
            document.addData(res.data);
            const pick = await vscode.window.showInformationMessage("The report have been created successfully", "Open",);
            if (pick === "Open") {
                vscode.env.openExternal(vscode.Uri.file(path));
            }
        }
        else {
            vscode.window.showInformationMessage("There are no data to display.");

        }

    } catch (error: any) {
        vscode.window.showInformationMessage(error.message);
    }
}