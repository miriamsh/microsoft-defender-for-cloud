import * as vscode from 'vscode';

export async function showFilteringMenu(filters: vscode.QuickPickItem[], category: string) {
    try {
        const picks: vscode.QuickPickItem[] | undefined = await vscode.window.showQuickPick(
            filters,
            {
                canPickMany: true,
                placeHolder: `Filter ${category} By...`,
            });
        return picks ? picks : undefined;
    }
    catch (error) {
        throw error;
    }
}