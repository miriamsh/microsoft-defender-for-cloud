"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReport = void 0;
const axios_1 = require("axios");
const vscode = require("vscode");
const PDF_1 = require("../Document/PDF");
async function createReport(context, node) {
    const path = context.extensionPath + '\\new\\mdc_report.pdf';
    try {
        const res = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
        }, async (progress) => {
            progress.report({
                message: `Creating report ...`,
            });
            return await axios_1.default.post('https://mdc-report-function.azurewebsites.net/api/report-function?', {
                token: await node.subscription.credentials.getToken(),
                url: node.apiUrl,
                filterSettings: node.filter
            });
        });
        if (res.data.length > 0) {
            const document = new PDF_1.PDF(path, node.model);
            document.addData(res.data);
            const pick = await vscode.window.showInformationMessage("The report have been created successfully", "Open");
            if (pick === "Open") {
                vscode.env.openExternal(vscode.Uri.file(path));
            }
        }
        else {
            vscode.window.showInformationMessage("There are no data to display.");
        }
    }
    catch (error) {
        vscode.window.showInformationMessage(error.message);
    }
}
exports.createReport = createReport;
//# sourceMappingURL=createReport.js.map