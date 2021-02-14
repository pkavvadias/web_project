function getInfo() {
    var xhr = new XMLHttpRequest();


    xhr.open("GET", "http://localhost:3000/getuserstats", true);

    //xhr.setRequestHeader('Content-Type', 'json');
    xhr.responseType = 'json';

    xhr.onload = function() {
        var x = xhr.response;
        var theDiv = document.getElementById("username");
        var content = document.createTextNode("Username: " + x.username);
        theDiv.appendChild(content);

        var theDiv1 = document.getElementById("email");
        var content1 = document.createTextNode("Email: " + x.email);
        theDiv1.appendChild(content1);


    }
    xhr.send()
}


document.addEventListener("DOMContentLoaded", getInfo)
    //window.onload = getInfo();