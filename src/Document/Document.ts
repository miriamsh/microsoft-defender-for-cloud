import { Alert, Resource } from "@azure/arm-security";

export interface Document
{
    addData(data: [][]):any;
    createTable(data:any,model:any):any;
    createHeaders(item:any,model:any):any;
    createRow(item:any,model:any):any;
};