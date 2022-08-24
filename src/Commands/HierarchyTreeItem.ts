export class HierarchyTreeItem {
   private name!: string;
   private children!: HierarchyTreeItem[];
   private parent!: boolean;
   private iconPath!: string;

   constructor(name: string, parent: boolean, iconPath: string, children: HierarchyTreeItem[] | null) {
      this.name = name;
      this.parent = parent;
      this.children = children!;
      this.iconPath = iconPath;
   }


   public setChildren(children: HierarchyTreeItem[]) {
      this.children = children;
   }

}