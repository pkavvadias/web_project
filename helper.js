const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'webproject',
    password: 'admin',
    port: 5432,
})
var http = require('http');

function getIpInfo(ip, JSONdata) {

    url = 'http://ip-api.com/json/' + ip;
    http.get(url, function(resp) {
        if (resp.statusCode == 404) {
            console.log(url);
            getIpInfo(ip);
        } else {

            var body = ''
            resp.on('data', function(data) {
                body += data;
            });

            resp.on('end', function() {
                var location = JSON.parse(body);
                for (x in JSONdata) {
                    JSONdata[x].city = location.city;
                    JSONdata[x].isp = location.isp;
                    JSONdata[x].latitude_city = location.lat;
                    JSONdata[x].longitude_city = location.lon;
                }
                pool.query('INSERT INTO har_data SELECT * FROM json_populate_recordset(null::har_data,$1)', [JSON.stringify(JSONdata)], (error, results) => {
                    if (error) {
                        throw error
                    }
                })
            });
            resp.on('error', function() {
                console.log("katse kala re bro");
                getIpInfo(ip);
            });
        }

    });
}

function getCurrentDate() {
    // current timestamp in milliseconds
    let ts = Date.now();

    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD format
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
}

module.exports = {
    getIpInfo,
    getCurrentDate,
}
module.exports.pool = pool