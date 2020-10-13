import csv from 'csv-parser';
import fs from 'fs';
import tedious from "tedious";
import connection from './sql.utils.js'

export class ControllerData {

    pharmacies = [];

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
            const request = new tedious.Request(`INSERT INTO pharmacies (Nom, Tel, Adresse, Quartier, Ville, Geographie)   
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
                resolve(JSON.parse("[" + response + "]"));
            });

            request.on('errorMessage', (infoError) => {
                 reject(infoError)
            });

            connection.execSql(request);
        })
    }

    getNearestPharmacies({lat, long}) {
        return new Promise(async (resolve, reject) => {
            this.pharmacies = await this.getPharmacies();
            resolve(this.NearestPharmacies(lat, long));
        })
    }



    // Convert Degress to Radians
    Deg2Rad(deg) {
        return deg * Math.PI / 180;
    }
  
    PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
        lat1 = this.Deg2Rad(lat1);
        lat2 = this.Deg2Rad(lat2);
        lon1 = this.Deg2Rad(lon1);
        lon2 = this.Deg2Rad(lon2);
        var R = 10; // km
        var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
        var y = (lat2 - lat1);
        var d = Math.sqrt(x * x + y * y) * R;
        return d;
    }
  
    NearestPharmacies(latitude, longitude) {
        var minDif = 99999;
        var closest;
        for (let i = 0; i < this.pharmacies.length; ++i) {
            var dif = this.PythagorasEquirectangular(latitude, longitude, 
                parseFloat(this.pharmacies[i].Geographie.split(',')[0]), 
                parseFloat(this.pharmacies[i].Geographie.split(',')[1]));
            if (dif < minDif) {
                closest = i;
                minDif = dif;
            }
        }
        return this.pharmacies[closest]
    }
  
}
