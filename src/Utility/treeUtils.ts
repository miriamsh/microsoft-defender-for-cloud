import * as path from "path";
import { TreeItemIconPath } from "vscode-azureextensionui";
import { Constants } from "../Constants";

export class TreeUtils {

    public static getIconPath(iconName: string,suffix:string="svg"): string {
        return path.join(Constants.resourcesFolderPath, `${iconName}.${suffix}`);
    }

    public static getThemedIconPath(iconName: string): TreeItemIconPath {
        return {
            light: path.join(Constants.resourcesFolderPath, "light", `${iconName}.svg`),
            dark: path.join(Constants.resourcesFolderPath, "dark", `${iconName}.svg`),
        };
    }
}
