function heatmapUser() {
    // data = JSON.stringify(formdata);
    // console.log(data);
    var xhr = new XMLHttpRequest();


    xhr.open("GET", "http://localhost:3000/visitedips", true);
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


            var xhr_new = [];
            var data_obj = {};
            for (i in ips) {
                (function(i) {

                    xhr_new[i] = new XMLHttpRequest();
                    url = 'https://get.geojs.io/v1/ip/geo/' + ips[i] + '.json';
                    xhr_new[i].open("GET", url, false);

                    xhr_new[i].onreadystatechange = function() {
                        if (xhr_new[i].readyState === 4 && xhr_new[i].status === 200) {

                            res = JSON.parse(xhr_new[i].responseText);
                            data_obj[i] = {
                                lat: parseFloat(res.latitude),
                                long: parseFloat(res.longitude),
                                count: parseFloat(ips_count[i])
                            };
                        }
                    }

                })(i);

                xhr_new[i].send()
            }

            console.log(data_obj)

            var addressPoints = [];
            for (i in data_obj) {
                addressPoints[i] = [data_obj[i].lat, data_obj[i].long, data_obj[i].count]
            }

            //  console.log(addressPoints)


            var map = L.map('mapid').setView([37.4043, -122.0748], 12);

            var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            var heat = L.heatLayer(addressPoints, {
                minOpacity: 1,
                max: 1000,
                radius: 20,
                blur: 20,
                gradient: {
                    0.4: '#f23e45',
                    0.50: 'lime',
                    0.70: 'yellow',
                    0.95: '#FF8300',
                    1.0: 'red'
                }
            }).addTo(map);
        }

    }
}
document.addEventListener('DOMContentLoaded', heatmapUser);