 function basicInf() {
     // data = JSON.stringify(formdata);
     // console.log(data);
     var xhr = new XMLHttpRequest();


     xhr.open("GET", "http://localhost:3000/getadmindata", true);

     //xhr.setRequestHeader('Content-Type', 'json');
     xhr.responseType = 'json';

     xhr.onload = function() {
         var x = xhr.response;
         //console.log(x)
         //console.log((x['users']))
         //console.log(x['methodcount'])
         //console.log(x['statuscount'])
         //console.log(x['domaincount'])
         //console.log(x['isps'])
         //console.log(x['avgage'])
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
         console.log(x.avgage);
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
     adminMap();
 }

 function adminMap() {
     var xhr = new XMLHttpRequest();

     xhr.open("GET", "http://localhost:3000/getserverips", true);
     xhr.responseType = 'json';
     xhr.send();
     xhr.onreadystatechange = function() {
         if (xhr.readyState === 4 && xhr.status === 200) {
             var x = xhr.response;

             var ips = x.filter(function(e) {
                 if (e.serveripaddress == "") {
                     return false;
                 }
                 return true;
             }).map(function(e) {

                 return e.serveripaddress;


             });

             var ips_count = x.filter(function(e) {
                 if (e.serveripaddress == "") {
                     return false;
                 }
                 return true;
             }).map(function(e) {
                 return e.count;
             });

             var userip = x.filter(function(e) {
                 if (e.serveripaddress == "") {
                     return false;
                 }
                 return true;
             }).map(function(e) {
                 return e.userip;
             });

             var xhr_new = [];
             var data_obj = {};
             for (i in ips) {
                 (async function(i) {

                     xhr_new[i] = new XMLHttpRequest();
                     url = 'https://get.geojs.io/v1/ip/geo/' + ips[i] + '.json';
                     xhr_new[i].open("GET", url, false);

                     xhr_new[i].onreadystatechange = function() {
                         if (xhr_new[i].readyState === 4 && xhr_new[i].status === 200) {

                             res = JSON.parse(xhr_new[i].responseText);
                             data_obj[i] = {
                                 userip: userip[i],
                                 lat: parseFloat(res.latitude),
                                 long: parseFloat(res.longitude),
                                 count: parseFloat(ips_count[i])
                             };
                         }
                     }

                 })(i);

                 xhr_new[i].send()
             }
             console.log("aaa")
             console.log(data_obj)
             var uniqueuserip = [...new Set(userip)] //get unique userips

             var userlocations = new Object();
             for (x in uniqueuserip) {
                 userlocations[uniqueuserip[x]] = new Array();
                 var xhr_user = new XMLHttpRequest();
                 url = 'https://get.geojs.io/v1/ip/geo/' + uniqueuserip[x] + '.json';
                 xhr_user.open("GET", url, false);
                 xhr_user.onreadystatechange = function() {
                     if (xhr_new[i].readyState === 4 && xhr_new[i].status === 200) {

                         res = JSON.parse(xhr_user.responseText);
                         console.log(res.latitude);
                         console.log(res.longitude);
                         userlocations[uniqueuserip[x]].push(res.latitude);
                         userlocations[uniqueuserip[x]].push(res.longitude);
                     }
                 }
                 xhr_user.send();

             }
             console.log(userlocations);
             for (x in data_obj) {

             }
             var map = L.map('markers').setView([37.9838, 23.72753], 3);
             var tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
                 attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
             }).addTo(map);

             var geojsonMarkerOptions = {
                 radius: 8,
                 fillColor: "#ff7800",
                 color: "#000",
                 weight: 1,
                 opacity: 1,
                 fillOpacity: 0.8
             };

             for (x in uniqueuserip) {

                 console.log(userlocations[uniqueuserip[x]][0]);
                 var geojsonFeature = {
                     "type": "Feature",
                     "geometry": {
                         "type": "Point",
                         "coordinates": [userlocations[uniqueuserip[x]][1], userlocations[uniqueuserip[x]][0]]
                     }
                 };
                 //L.geoJSON(geojsonFeature).addTo(map);

                 var latlng = L.latLng(userlocations[uniqueuserip[x]][0], userlocations[uniqueuserip[x]][1]);
                 L.geoJSON(geojsonFeature, {
                     pointToLayer: function(feature, latlng) {
                         return L.circleMarker(latlng, geojsonMarkerOptions);
                     }
                 }).addTo(map);
             }
             console.log(Math.max(...ips_count));
             for (x in uniqueuserip) {
                 var userPoint = new L.LatLng(userlocations[uniqueuserip[x]][0], userlocations[uniqueuserip[x]][1]);
                 for (y in data_obj) {
                     var serverPoint = new L.LatLng(data_obj[y].lat, data_obj[y].long)
                     if (data_obj[y].userip == uniqueuserip[x]) {
                         var pointList = [userPoint, serverPoint];
                         var geojsonFeature = {
                             "type": "Feature",
                             "geometry": {
                                 "type": "Point",
                                 "coordinates": [data_obj[y].long, data_obj[y].lat]
                             }
                         };
                         L.geoJSON(geojsonFeature).addTo(map);
                         var polylineWeight;
                         if ((data_obj[y].count) / Math.max(...ips_count) < 0.3) {
                             polylineWeight = 0.3;
                         } else {
                             polylineWeight = (data_obj[y].count) / Math.max(...ips_count);
                         }
                         var firstpolyline = new L.Polyline(pointList, {
                             color: 'red',
                             weight: polylineWeight,
                             opacity: 0.5,
                             smoothFactor: 1
                         });
                         firstpolyline.addTo(map);
                     }
                 }
             }

         }

     }
 }

 //document.addEventListener('DOMContentLoaded', basicInf);
 //document.addEventListener('load', adminMap);
 //document.addEventListener('DOMContentLoaded', adminMap);
 //console.log(JSON.parse(xhr));
 window.onload = basicInf();
 //window.onload = adminMap();