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
            request.on('row', function(columns) {
                columns.forEach(function(column) {
                console.log(column.value);
                });
            });
            connection.execSql(request);
        })
    }
    
}
