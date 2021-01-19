const helper = require('./helper')
const bcrypt = require("bcrypt")
const passport = require("passport")
var https = require('https')
const uploadHar = (request, response) => {
    var JSONtoInsert = new Array();
    //console.log(request.ip);
    //var userIP = request.ip; 
    //console.log(request.user.username);
    var userIP = "85.75.169.61"; //Remove when on server,just for test
    for (i = 0; i < request.body.length; i++) {
        finalJSON = {
            "username_user": request.user.username,
            "starteddatetime": request.body[i].startedDateTime,
            "serveripaddress": request.body[i].serverIPAddress,
            "wait": request.body[i].wait,
            "method": request.body[i].method,
            "domain": request.body[i].url,
            "status": request.body[i].status,
            "statustext": request.body[i].statusText,
            "content_type": request.body[i].Content_Type,
            "cache_control": request.body[i].Cache_Control,
            "pragma": request.body[i].Pragma,
            "expires": request.body[i].Expires,
            "age": request.body[i].Age,
            "last_modified": request.body[i].Last_Modified,
            "host": request.body[i].Host,
            //"latitude_server":'',// serverIp.latitude,
            //"longitude_server":'',//serverIp.longtitude,
            "date": helper.getCurrentDate(),
            "userip": userIP,
            "isp": '',
            "city": '',
            "latitude_city": '',
            "longitude_city": '',
        }

        JSONtoInsert.push(finalJSON);
    }
    helper.getIpInfo(userIP, JSONtoInsert);
    response.sendStatus(200);
}


const updateUser = (request, response) => {
    helper.pool.query(
        'SELECT password FROM users WHERE username = $1', [request.user.username],
        (err, results) => {
            if (err) {
                throw err;
            }
            bcrypt.compare(request.body.password_old, results.rows[0].password, async (err, isMatch) => {
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    console.log("BCRYPT");
                    let hashedPassword = await bcrypt.hash(request.body.password, 10);
                    console.log(hashedPassword)
                    helper.pool.query(
                        'UPDATE users SET username=$1, password=$2 WHERE username=$3', [request.body.username, hashedPassword, request.user.username],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            //request.logOut();
                            //request.user.username = request.body.username;
                            response.status(200).send("Successfull update.");
                        }
                    )
                } else {
                    response.status(403).send("Wrong password")

                }

            })
        })
}

const getAdminData = (request, response) => {
    var AverageAge = new Array();
    helper.pool.query('SELECT COUNT(username) FROM users', (err, results) => {
        usernumber = results.rows[0].count;
        helper.pool.query('SELECT method, COUNT(*) FROM har_data GROUP BY method', (err, results) => {
            methods = results.rows;
            helper.pool.query('SELECT status, COUNT(*) FROM har_data GROUP BY status', (err, results) => {
                status = results.rows;
                helper.pool.query('SELECT COUNT (DISTINCT domain) FROM har_data', (err, results) => {
                    domainNumber = results.rows[0].count;
                    helper.pool.query('SELECT COUNT (DISTINCT isp) FROM har_data', (err, results) => {
                        ispNumber = results.rows[0].count;
                        helper.pool.query('SELECT content_type,starteddatetime,last_modified FROM har_data', (err, results) => {
                            items = results.rows;
                            var temp = new Array();
                            for(x in items){
                                if(items[x].last_modified != 'null'){
                                    items[x].content_type = items[x].content_type.split(';')[0];
                                    temp.push(items[x])
                                }
                            }
                            var contentTypes = [...new Set(temp.map(item => item.content_type))];
                            var ContentStats = new Array();
                            for (x in contentTypes){
                                ContenTypeJSON = {
                                    type: contentTypes[x],
                                    totalAge : '0',
                                    occurences : '0'
                                }
                                ContentStats.push(ContenTypeJSON);
                            }
                
                            for (x in temp){
                                for (y in ContentStats){
                                    if(temp[x].content_type == ContentStats[y].type){
                                        var startTime = temp[x].starteddatetime.getTime();
                                        var endTime = new Date( temp[x].last_modified).getTime();
                                        ContentStats[y].totalAge = Number(ContentStats[y].totalAge) + (startTime-endTime);
                                        ContentStats[y].occurences = Number(ContentStats[y].occurences) + 1;
                                    }
                                }
                            }            
                            for(x in ContentStats){
                                AgeJSON ={
                                    type : ContentStats[x].type,
                                    avg : Number(ContentStats[y].totalAge) / Number(ContentStats[y].occurences)
                                }
                                AverageAge.push(AgeJSON);
                            }
                            AdminJSON = {
                                users : usernumber,
                                methodcount : methods,
                                statuscount : status,
                                domaincount : domainNumber,
                                isps : ispNumber,
                                avgage : AverageAge

                            }
                            response.json(AdminJSON);
                        })
                    })
                })
            })
        })

    })    
}
module.exports = {
    uploadHar,
    updateUser,
    getAdminData
}