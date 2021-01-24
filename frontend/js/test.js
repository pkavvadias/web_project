var parsed;
var modified;
data = new Array();
document.getElementById('myFile').addEventListener('change', function selectedFileChanged() {
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
        parsed = JSON.parse(reader.result);
        if (typeof parsed.log == 'undefined' && parsed[0].url != 'undefined') { //Check if file is already at the needed format
            modified = parsed;
        }
        else {
            for (i = 0; i < parsed.log.entries.length; i++) {
                let host, contentType, cacheControl, pragma, expires, 
                age = 'null';
                lastModified = 'null';
                for (j = 0; j < parsed.log.entries[i].request.headers.length; j++) {
                    if (parsed.log.entries[i].request.headers[j].name == "Host") {
                        host = parsed.log.entries[i].request.headers[j].value
                    }
                    else if (parsed.log.entries[i].request.headers[j].name == "Content-Type") {
                        contentType = parsed.log.entries[i].request.headers[j].value;
                    }
                    else if (parsed.log.entries[i].request.headers[j].name == "Cache-Control") {
                        cacheControl = parsed.log.entries[i].request.headers[j].value;
                    }
                    else if (parsed.log.entries[i].request.headers[j].name == "Pragma") {
                        pragma = parsed.log.entries[i].request.headers[j].value;
                    }
                    else if (parsed.log.entries[i].request.headers[j].name == "Expires") {
                        expires = parsed.log.entries[i].request.headers[j].value;
                    }
                    else if (parsed.log.entries[i].request.headers[j].name == "Age") {
                        age = parsed.log.entries[i].request.headers[j].value;
                    }
                    else if (parsed.log.entries[i].request.headers[j].name == "Last-Modified") {
                        lastModified = parsed.log.entries[i].request.headers[j].value;
                    }
                }
                for (k = 0; k < parsed.log.entries[i].response.headers.length; k++) {
                    if (parsed.log.entries[i].response.headers[k].name == "Host") {
                        host = parsed.log.entries[i].response.headers[k].value
                    }
                    else if (parsed.log.entries[i].response.headers[k].name == "Content-Type") {
                        contentType = parsed.log.entries[i].response.headers[k].value;
                    }
                    else if (parsed.log.entries[i].response.headers[k].name == "Cache-Control") {
                        cacheControl = parsed.log.entries[i].response.headers[k].value;
                    }
                    else if (parsed.log.entries[i].response.headers[k].name == "Pragma") {
                        pragma = parsed.log.entries[i].response.headers[k].value;
                    }
                    else if (parsed.log.entries[i].response.headers[k].name == "Expires") {
                        expires = parsed.log.entries[i].response.headers[k].value;
                    }
                    else if (parsed.log.entries[i].response.headers[k].name == "Age") {
                        age = parsed.log.entries[i].response.headers[k].value;
                    }
                    else if (parsed.log.entries[i].response.headers[k].name == "Last-Modified") {
                        lastModified = parsed.log.entries[i].response.headers[k].value;
                    }
                }
                url = parsed.log.entries[i].request.url;
                ip = parsed.log.entries[i].serverIPAddress;
                temp = ip.replace("[","");
                temp2=temp.replace("]","");//Quick fix for ipv6
                if (contentType == null || contentType == ''){
                    contentType = "text/html"
                }
                contentType = contentType.split(';')[0];//to clear not needed values
                let modifiedHar = {
                    "startedDateTime": parsed.log.entries[i].startedDateTime,
                    "wait": parsed.log.entries[i].timings.wait,
                    "serverIPAddress": temp2,
                    "method": parsed.log.entries[i].request.method,
                    "url": getDomain(url),
                    "status": parsed.log.entries[i].response.status,
                    "statusText": parsed.log.entries[i].response.statusText,
                    "Content_Type": contentType,
                    "Cache_Control": cacheControl,
                    "Pragma": pragma,
                    "Expires": expires,
                    "Age": age,
                    "Last_Modified": lastModified,
                    "Host": host,

                }
                data.push(modifiedHar);
            }
        }
    };
    reader.readAsText(this.files[0]);
});

function getDomain(url) {
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
        }
    }
    return result
}
function DownloadJSON(argument) {
    argument = [argument];//Converting JSON string to BLOB
    var blob1 = new Blob(argument, { type: "application/json" });
    var url = window.URL || window.webkitURL;
    link = url.createObjectURL(blob1);
    var a = document.createElement("a");
    a.download = "Modified.json";
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function Export() {
    
    modified = JSON.stringify(data,undefined, '\t');
    DownloadJSON(modified)
}
function SendToServer() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:3000/uploadHar", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data,undefined, '\t'));
}


