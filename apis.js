const helper = require('./helper')

const uploadHar = (request, response) => {
  var JSONtoInsert = new Array();
    //console.log(request.ip);
    //var userIP = request.ip; 
    var userIP = "85.75.169.61";//Remove when on server,just for test
    for (i = 0; i < request.body.length; i++) {
        finalJSON = {
            "username_user": "username",//TODO:username from user session
            "starteddatetime": request.body[i].startedDateTime,
            "serveripaddress": request.body[i].serverIPAddress,
            "wait": request.body[i].wait,
            "method": request.body[i].method,
            "domain": request.body[i].url,
            "status": request.body[i].status,
            "statustext": request.body[i].statusText,
            "content_type": request.body[i].Content_Type,
            "cache_control":request.body[i].Cache_Control,
            "pragma": request.body[i].Pragma,
            "expires": request.body[i].Expires,
            "age":request.body[i].Age,
            "last_modified": request.body[i].Last_Modified,
            "host": request.body[i].Host,
            //"latitude_server":'',// serverIp.latitude,
            //"longitude_server":'',//serverIp.longtitude,
            "date": helper.getCurrentDate(),
            "userip": userIP,
            "isp": '',
            "city": '',
            "latitude_city": '',
            "longitude_city":'',

        }
        
        JSONtoInsert.push(finalJSON);
    }
    helper.getIpInfo(userIP,JSONtoInsert);
    response.sendStatus(200);
}

  module.exports = {
    uploadHar,
  }