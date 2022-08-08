import * as path from "path";
import { TreeItemIconPath } from "vscode-azureextensionui";
import { Constants } from "../constants";

export class TreeUtils {

    public static getIconPath(iconName: string): string {
        return path.join(Constants.resourcesFolderPath, `${iconName}.svg`);
    }

    public static getThemedIconPath(iconName: string): TreeItemIconPath {
        return {
            light: path.join(Constants.resourcesFolderPath, "light", `${iconName}.svg`),
            dark: path.join(Constants.resourcesFolderPath, "dark", `${iconName}.svg`),
        };
    }
}