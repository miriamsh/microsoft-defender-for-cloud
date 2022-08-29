"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDF = void 0;
const fs = require("fs");
const PDFDocument = require("pdfkit-table");
class PDF {
    constructor(path, model) {
        this.model = model;
        this.document = new PDFDocument({ margin: 30, size: 'A4' });
        this.document.pipe(fs.createWriteStream(path));
    }
    async addData(data) {
        data.forEach(async (item, index) => {
            const table = this.createTable(item, this.model[index]);
            await this.document.table(table);
        });
        this.document.end();
    }
    createTable(data, model) {
        let headers = [];
        let rows = [];
        headers = this.createHeaders(model);
        data.forEach((value) => {
            rows.push(this.createRow(value, model));
        });
        const table = {
            title: model.constructor.name,
            headers: headers,
            rows: rows,
        };
        return table;
    }
    createRow(item, model) {
        let row = [];
        let prop;
        for (prop in model) {
            const dataObject = item[prop];
            if (typeof model[prop] === 'object') {
                const object = model[prop];
                let subProp;
                for (subProp in object) {
                    if (typeof object[subProp] === 'object') {
                        const subObject = object[subProp];
                        const dataSubObject = dataObject !== undefined ? dataObject[subProp] : undefined;
                        let internalProp;
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
                dataObject !== undefined ? row.push(dataObject) : row.push('');
            }
        }
        return row;
    }
    createHeaders(model) {
        let headers = [];
        let prop;
        for (prop in model) {
            if (typeof model[prop] === 'object') {
                const object = model[prop];
                let subProp;
                for (subProp in object) {
                    if (typeof object[subProp] === 'object') {
                        const subObject = object[subProp];
                        let internalProp;
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
exports.PDF = PDF;
//# sourceMappingURL=PDF.js.map