import * as vscode from 'vscode';

//Shows inputBoxMenu
export async function singleStepInputBox(placeHolder: string, title: string, value?:string): Promise<string> {

    const options: vscode.InputBoxOptions = {
        "placeHolder": placeHolder,
        "title": title,
        "ignoreFocusOut": true, 
        value:value? value:''
    };

    const input = await vscode.window.showInputBox(options);
    return input !== undefined ? input : "";
}

//Shows quickPickInputBox
export async function singleStepPickInputBox(items: string[], title: string): Promise<string> {

    const options: vscode.QuickPickOptions = {
        "canPickMany": false,
        "title": title
    };

    const picked = await vscode.window.showQuickPick(items,);
    return picked !== undefined ? picked : "";
}