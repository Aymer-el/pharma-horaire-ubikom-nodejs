import csv from 'csv-parser';
import fs from 'fs';
import tedious from "tedious";
import connection from './sql.utils.js'

export class ControllerData {
    readCSV() {
        return new Promise((resolve, reject)=> {
        const table = []
        fs.createReadStream('./data.csv')
        .pipe(csv())
        .on('data', (row) => {
            table.push(Object.values(row).map((ojb) => "'"+ ojb.replace("'", "") + "'"))
        })
        .on('end', (e) => {
            resolve(table)
        });
        })
    }

    readCSVtoJSON() {
        return new Promise((resolve, reject)=> {
        const table = []
        fs.createReadStream('./data.csv')
        .pipe(csv())
        .on('data', (row) => {
            table.push(row)
        })
        .on('end', (e) => {
            resolve(table)
        });
        })
    }


    sendDataToServer() {
        //queryDatabase();
        this.readCSV().then((data) => {
            // Read all rows from table
            let dataSQL = '(';
            dataSQL += data.join('),(');
            dataSQL += ')';
            const request = new tedious.Request(`INSERT INTO pharmacies (Nom, Tel, Adresse, Quartier, Ville)   
                VALUES `+ dataSQL,
                (err, rowCount) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(`${rowCount} row(s) returned`);
                }
                }
            );
            connection.execSql(request);
        })
    }

    getPharmacies() {
        return new Promise((resolve, reject) => {
            const request = new tedious.Request(`SELECT * FROM pharmacies 
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER`,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`${rows} row(s) returned`);
                    }
                }
            );
            let response = ''
            request.on('doneInProc', function (rowCount, more, rows) {
                rows.forEach(function(column) {
                    response += column[0].value;
                });
            });
            
            request.on('requestCompleted', function (rowCount, more, rows) {
                resolve(JSON.parse("[" + response + "]"))
            });

            request.on('errorMessage', (infoError) => {
                 reject(infoError)
            });

            connection.execSql(request);
        })
    }
}
