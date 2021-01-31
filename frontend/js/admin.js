 function basicInf() {
     // data = JSON.stringify(formdata);
     // console.log(data);
     var xhr = new XMLHttpRequest();


     xhr.open("GET", "http://127.0.0.1:3000/getadmindata", true);

     //xhr.setRequestHeader('Content-Type', 'json');
     xhr.responseType = 'json';

     xhr.onload = function() {
         var x = xhr.response;

         console.log((x['users']))
         console.log(x['methodcount'])
         console.log(x['statuscount'])
         console.log(x['domaincount'])
         console.log(x['isps'])
         console.log(x['avgage'])
         var ctx = document.getElementById('myChart').getContext('2d');
         // Random colors
         var newColors = function() {
             var r = Math.floor(Math.random() * 255);
             var g = Math.floor(Math.random() * 255);
             var b = Math.floor(Math.random() * 255);
             return "rgb(" + r + "," + g + "," + b + ")";
         };
         var BarChart = new Chart(ctx, {
             // The type of chart we want to create
             type: 'horizontalBar',

             // The data for our dataset
             data: {
                 labels: ['Users', 'Domains', 'ISPs'],
                 datasets: [{
                     label: 'Users-Domains-ISPs',

                     data: [Number(x['users']),
                         Number(x['domaincount']), Number(x['isps'])
                     ],
                     fill: false,
                     backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)"],
                     borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)"],
                     borderWidth: 1
                 }]
             },
             options: { "scales": { "yAxes": [{ "ticks": { "beginAtZero": true } }] } }
         })
         var labelsMethods = x.methodcount.map(function(e) {
             return e.method;
         });
         var valuesMethods = x.methodcount.map(function(e) {
             return e.count;
         });

         // Dynamically assign colors
         var color1 = [];
         for (var i in labelsMethods) {
             color1.push(newColors());
         }

         var ctx1 = document.getElementById('myChart1').getContext('2d');
         var BarChart1 = new Chart(ctx1, {
             // The type of chart we want to create
             type: 'horizontalBar',

             // The data for our dataset
             data: {
                 labels: labelsMethods,
                 datasets: [{
                     label: 'Methods',

                     data: valuesMethods,
                     fill: false,
                     backgroundColor: color1,
                     borderColor: ["rgb(255, 99, 132)"],
                     borderWidth: 1
                 }]
             },
             options: { "scales": { "yAxes": [{ "ticks": { "beginAtZero": true } }] } }
         })

         var labelsStatus = x.statuscount.map(function(e) {
             return e.status;
         });
         var valuesStatus = x.statuscount.map(function(e) {
             return e.count;
         });

         // Dynamically assign colors
         var color2 = [];
         for (var i in labelsStatus) {
             color2.push(newColors());
         }

         var ctx2 = document.getElementById('myChart2').getContext('2d');
         var BarChart2 = new Chart(ctx2, {
             // The type of chart we want to create
             type: 'horizontalBar',

             // The data for our dataset
             data: {
                 labels: labelsStatus,
                 datasets: [{
                     label: 'Status',

                     data: valuesStatus,
                     fill: false,
                     backgroundColor: color2,
                     borderColor: ["rgb(255, 99, 132)"],
                     borderWidth: 1
                 }]
             },
             options: { "scales": { "yAxes": [{ "ticks": { "beginAtZero": true } }] } }
         })

         var labelsAvgAge = x.avgage.map(function(e) {
             return e.type;
         });
         var valuesAvgAge = x.avgage.map(function(e) {
             var mins = e.avg / 60000;
             var hrs = mins / 60;
             var days = hrs / 24;
             return days;
         });

         // Dynamically assign colors
         var color3 = [];
         for (var i in labelsAvgAge) {
             color3.push(newColors());
         }

         var ctx3 = document.getElementById('myChart3').getContext('2d');
         var BarChart3 = new Chart(ctx3, {
             // The type of chart we want to create
             type: 'bar',

             // The data for our dataset
             data: {
                 labels: labelsAvgAge,
                 datasets: [{
                     label: 'Average Age',

                     data: valuesAvgAge,
                     fill: false,
                     backgroundColor: color3,
                     borderColor: 'rgba(200, 200, 200, 0.75)',
                     borderWidth: 2
                 }]
             },
             options: { "scales": { "yAxes": [{ "ticks": { "beginAtZero": true } }] } },
         })

     }
     xhr.send();
 }



 document.addEventListener('DOMContentLoaded', basicInf);

 //console.log(JSON.parse(xhr));