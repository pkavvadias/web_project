function HTTPAnalysis() {

    var xhr = new XMLHttpRequest();


    xhr.open("GET", "http://127.0.0.1:3000/headeranalysis", true);

    //xhr.setRequestHeader('Content-Type', 'json');
    xhr.responseType = 'json';
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var x = xhr.response;
            console.log(x.ttl);

            var labelsTTL = x.ttl.map(function(e) {
                return e.content_type;
            });
            var valuesTTL = x.ttl.map(function(e) {
                var mins = e.time / 60000;
                var hrs = mins / 60;
                var days = hrs / 24;
                return days;

            });

            var ctx2 = document.getElementById('myChart4').getContext('2d');
            var BarChart2 = new Chart(ctx2, {
                // The type of chart we want to create
                type: 'bar',

                // The data for our dataset
                data: {
                    labels: labelsTTL,
                    datasets: [{
                        label: 'TTL',

                        data: valuesTTL,
                        fill: false,
                        backgroundColor: ["rgb(255, 99, 132)"],
                        borderColor: ["rgb(255, 99, 132)"],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            display: false,
                            barPercentage: 1.3,
                            ticks: {
                                max: 100,
                            }
                        }, {
                            display: true,
                            ticks: {
                                autoSkip: false,
                                max: 50,
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
                // Calculating bucket range
                /* bucket_range = (Math.max.apply(null, valuesTTL) - Math.min.apply(null, valuesTTL)) / 10;
                 console.log(bucket_range)

                 var Combined = new Array();
                 Combined[0] = ['Content-Type', 'Time'];
                 for (var i = 0; i < labelsTTL.length; i++) {
                     Combined[i + 1] = [labelsTTL[i], valuesTTL[i]];
                 }*/



            })
        }
    }
}


function flow() {
    var xhr = new XMLHttpRequest();


    xhr.open("GET", "http://127.0.0.1:3000/getserverips", true);

    //xhr.setRequestHeader('Content-Type', 'json');
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

        }
    }
}
document.addEventListener('DOMContentLoaded', HTTPAnalysis);
document.addEventListener('DOMContentLoaded', flow);