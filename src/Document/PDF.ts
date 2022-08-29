import { Document } from "./Document";
import * as fs from 'fs';
const PDFDocument = require("pdfkit-table");

export class PDF implements Document {
  document: any;
  model: any;
  constructor(path: string, model: any) {
    this.model = model;
    this.document = new PDFDocument({ margin: 30, size: 'A4' });
    this.document.pipe(fs.createWriteStream(path));

  }
  async addData(data: [][]) {

    data.forEach(async (item: any, index: number) => {

      const table = this.createTable(item, this.model[index]);
      await this.document.table(table);
    });
    this.document.end();

  }
  createTable(data: any, model: any) {

    let headers: string[] = [];
    let rows: string[][] = [];

    headers = this.createHeaders(model);

    data.forEach((value: any) => {
      rows.push(this.createRow(value, model));
    });

    const table = {
      title: model.constructor.name,
      headers: headers,
      rows: rows,
    };
    return table;
  }

  createRow(item: any, model: any) {
    let row = [];
    let prop: keyof typeof model;

    for (prop in model) {

      const dataObject = item[prop];

      if (typeof model[prop] === 'object') {

        const object = model[prop];
        let subProp: keyof typeof object;

        for (subProp in object) {

          if (typeof object[subProp] === 'object') {

            const subObject = object[subProp];
            const dataSubObject = dataObject !== undefined ? dataObject[subProp] : undefined;

            let internalProp: keyof typeof subObject;
            for (internalProp in subObject) {

              dataSubObject !== undefined ? row.push(dataSubObject[internalProp]) : row.push('');
            }
          }
          else {
            dataObject !== undefined ? row.push(dataObject[subProp]) : row.push('');
          }
        }
      }
      else {
        dataObject!==undefined?row.push(dataObject):row.push('');

      }
    }
    return row;
  }
  createHeaders(model: any) {

    let headers = [];
    let prop: keyof typeof model;

    for (prop in model) {

      if (typeof model[prop] === 'object') {

        const object = model[prop];
        let subProp: keyof typeof object;

        for (subProp in object) {

          if (typeof object[subProp] === 'object') {

            const subObject = object[subProp];

            let internalProp: keyof typeof subObject;
            for (internalProp in subObject) {
              headers.push(subProp + ' ' + internalProp);
            }
          }
          else {
            headers.push(subProp);
          }
        }
      }
      else {
        headers.push(prop);
      }
    }
    return headers;
  }
}