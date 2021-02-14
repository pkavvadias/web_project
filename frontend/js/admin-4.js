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
                        userlocations[uniqueuserip[x]].push(res.latitude);
                        userlocations[uniqueuserip[x]].push(res.longitude);
                    }
                }
                xhr_user.send();

            }
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



document.addEventListener('DOMContentLoaded', adminMap);