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
    //var userIP = "79.167.22.79";
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

            if (request.body.password_old === "") {
                request.body.password_old = request.body.password_user;
            }
            console.log(request.body.username)
            bcrypt.compare(request.body.password_old, results.rows[0].password, async(err, isMatch) => {
                if (err) {
                    console.log(err);
                }
                if (isMatch) {
                    console.log("BCRYPT");
                    if (request.body.username === "") {
                        request.body.username = request.user.username;

                    }
                    var hashedPassword = 0;
                    if (request.body.password === "") {
                        hashedPassword = await bcrypt.hash(request.body.password_user, 10);;
                    } else {
                        hashedPassword = await bcrypt.hash(request.body.password, 10);
                    }

                    helper.pool.query(
                        'UPDATE users SET username=$1, password=$2 WHERE username=$3', [request.body.username, hashedPassword, request.user.username],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
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
                            for (x in items) {
                                if (items[x].last_modified != 'null') {
                                    items[x].content_type = items[x].content_type.split(';')[0];
                                    temp.push(items[x])
                                }
                            }
                            var contentTypes = [...new Set(temp.map(item => item.content_type))];
                            var ContentStats = new Array();
                            for (x in contentTypes) {
                                ContenTypeJSON = {
                                    type: contentTypes[x],
                                    totalAge: '0',
                                    occurences: '0'
                                }
                                ContentStats.push(ContenTypeJSON);
                            }

                            for (x in temp) {
                                for (y in ContentStats) {
                                    if (temp[x].content_type == ContentStats[y].type) {
                                        var startTime = temp[x].starteddatetime.getTime();
                                        var endTime = new Date(temp[x].last_modified).getTime();
                                        ContentStats[y].totalAge = Number(ContentStats[y].totalAge) + (startTime - endTime);
                                        ContentStats[y].occurences = Number(ContentStats[y].occurences) + 1;
                                    }
                                }
                            }
                            for (x in ContentStats) {
                                AgeJSON = {
                                    type: ContentStats[x].type,
                                    avg: Number(ContentStats[x].totalAge) / Number(ContentStats[x].occurences)
                                }
                                AverageAge.push(AgeJSON);
                            }
                            AdminJSON = {
                                users: usernumber,
                                methodcount: methods,
                                statuscount: status,
                                domaincount: domainNumber,
                                isps: ispNumber,
                                avgage: AverageAge

                            }
                            response.json(AdminJSON);
                        })
                    })
                })
            })
        })

    })
}

const getResponseTimes = (request, response) => {
    helper.pool.query('SELECT wait,content_type,starteddatetime,method,isp FROM har_data', (err, results) => {
        response.json(results.rows)
    })
}

const getServerIPs = (request, response) => {
    helper.pool.query('SELECT userip, serveripaddress, COUNT(*) FROM har_data GROUP BY serveripaddress,userip ORDER BY COUNT(*) DESC', (err, results) => {
        response.json(results.rows)
    })
}
const headerAnalysis = (request, response) => {
    var ISPs = new Array();
    var final = new Object();
    helper.pool.query('SELECT content_type,cache_control,expires,last_modified,isp FROM har_data', (err, results) => {
        items = results.rows;
        for (x in items) {
            ISPs.push(items[x].isp)
        }
        ISPs = [...new Set(ISPs)];
        for (y in ISPs) {
            final[ISPs[y]] = new Object();
            final[ISPs[y]].ttl = new Array();
            for (x in items) {
                var TTLJSON = {
                    content_type: '',
                    time: ''
                }
                if (items[x].cache_control != null && items[x].cache_control.search(/max-age=/) != -1 && items[x].isp == ISPs[y]) {
                    var index = items[x].cache_control.search(/max-age=/) //Regex to get max age
                    TTLJSON.content_type = items[x].content_type;
                    var maxage = items[x].cache_control.substring(index + 8).split(',')[0]; //get only max age value
                    TTLJSON.time = maxage;
                    final[ISPs[y]].ttl.push(TTLJSON);;
                } else if (items[x].expires != 'null' && items[x].last_modified != 'null' && items[x].isp == ISPs[y]) {
                    TTLJSON.content_type = items[x].content_type;
                    var expire = new Date(items[x].expires).getTime();
                    var lastmodif = new Date(items[x].last_modified).getTime();
                    TTLJSON.time = ((expire - lastmodif))   
                    final[ISPs[y]].ttl.push(TTLJSON);;
                }
            }
        }
        helper.pool.query('SELECT content_type,COUNT(content_type),isp FROM har_data GROUP BY content_type,isp', (err, results) => {
            var types = results.rows;
            helper.pool.query("SELECT COUNT(cache_control),content_type,isp FROM har_data WHERE cache_control LIKE '%min-fresh%' GROUP BY content_type,isp", (err, results) => {
                var minfresh = results.rows;
                helper.pool.query("SELECT COUNT(cache_control),content_type,isp FROM har_data WHERE cache_control LIKE '%max-stale%' GROUP BY content_type,isp", (err, results) => {
                    var max_stale = results.rows;
                    for (w in ISPs) {
                        final[ISPs[w]].percentages = new Array();
                        for (x in types) {
                            var percentageJSON = {
                                content_type: '0',
                                minfresh: '0',
                                maxstale: '0'
                            }
                            percentageJSON.content_type = types[x].content_type;
                            for (y in minfresh) {
                                if (minfresh[y] != null && minfresh[y].content_type == types[x].content_type && minfresh[y].isp == ISPs[w]) {
                                    percentageJSON.minfresh = (minfresh[y].count / types[x].count)
                                }
                            }
                            for (z in max_stale) {
                                if (max_stale[y] != null && max_staleh[y].content_type == types[x].content_type && max_stale[z].isp == ISPs[w]) {
                                    percentageJSON.max_stale = (max_stale[y].count / types[x].count)
                                }
                            }
                            final[ISPs[w]].percentages.push(percentageJSON);
                        }
                    }
                    helper.pool.query('SELECT COUNT(cache_control),content_type,isp FROM har_data WHERE cache_control IS NOT null GROUP BY content_type,isp', (err, results) => {
                        var cacheability = results.rows;
                        for (z in ISPs) {
                            final[ISPs[z]].cache = new Array();
                            for (x in types) {
                                var cacheabilityJSON = {
                                    content_type: '0',
                                    percentage: ''
                                }
                                for (y in cacheability) {
                                    cacheabilityJSON.content_type = types[x].content_type;
                                    if (cacheability[y].content_type == types[x].content_type && cacheability[y].isp == ISPs[z]) {
                                        cacheabilityJSON.percentage = (cacheability[y].count / types[x].count);
                                    }
                                }
                                final[ISPs[z]].cache.push(cacheabilityJSON)
                            }
                        }
                        response.json(final)
                    })
                })
            })
        })
    })
}

const getUserAddresses = (request, response) => {
    helper.pool.query("SELECT serveripaddress,COUNT(serveripaddress) FROM har_data WHERE username_user=$1 AND content_type LIKE '%html%' GROUP BY serveripaddress", [request.user.username], (err, results) => {
        response.json(results.rows)
    })
}


const getUserStats = (request, response) => {
    console.log(request.user.username)
    helper.pool.query("SELECT COUNT(*),username_user, date FROM har_data WHERE username_user=$1  GROUP BY username_user,date ORDER BY date DESC", [request.user.username], (err, results) => {
        if (results.rows[0] == null) {
            stats = {
                username: request.user.username,
                total: 0,
                lastdate: 0
            }
        } else {


            stats = {
                username: request.user.username,
                total: results.rows.length,
                lastdate: results.rows[0].date,
            }
        }
        helper.pool.query("SELECT email FROM users WHERE username=$1  GROUP BY email", [request.user.username], (err, results) => {
            stats['email'] = results.rows[0].email


            response.json(stats)

            console.log(stats)
        })
    })
}


module.exports = {
    uploadHar,
    updateUser,
    getAdminData,
    getResponseTimes,
    getServerIPs,
    headerAnalysis,
    getUserAddresses,
    getUserStats
}