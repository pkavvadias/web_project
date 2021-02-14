function Statistics() {
    var xhr = new XMLHttpRequest();


    xhr.open("GET", "http://localhost:3000/getuserstats", true);

    //xhr.setRequestHeader('Content-Type', 'json');
    xhr.responseType = 'json';

    xhr.onload = function() {
        var x = xhr.response;
        var theDiv = document.getElementById("username");
        var content = document.createTextNode("Hello " + x.username + "!");
        theDiv.appendChild(content);

        var theDiv1 = document.getElementById("total");
        var content1 = document.createTextNode("You have submitted a total of " + x.total + " HAR files!");
        theDiv1.appendChild(content1);

        var theDiv2 = document.getElementById("lastdate");
        if (x.lastdate === 0) {
            var content2 = document.createTextNode("You have never uploaded any HAR file. ");
            theDiv2.appendChild(content2);
        } else {
            var lastdate = new Date(x.lastdate)
            let date = lastdate.getDate();
            day = (date < 10) ? '0' + date : date;
            let month = lastdate.getMonth() + 1;
            mon = (month < 10) ? '0' + month : month;
            let year = lastdate.getFullYear();


            let hours = lastdate.getHours();
            let minutes = lastdate.getMinutes();
            let seconds = lastdate.getSeconds();

            h = (hours < 10) ? '0' + hours : hours;
            m = (minutes < 10) ? '0' + minutes : minutes;
            s = (seconds < 10) ? '0' + seconds : seconds;

            finalDate = (year + "-" + mon + "-" + day + " " + h + ":" + m + ":" + s);


            var content2 = document.createTextNode("Your last upload was at " + finalDate);
            theDiv2.appendChild(content2);
        }
    }
    xhr.send()
}



window.onload = Statistics();