function ResponseTimes() {

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:3000/getresponsetimes", true);

    //xhr.setRequestHeader('Content-Type', 'json');
    xhr.responseType = 'json';

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var x = xhr.response;
            let labelsMethods = x.map(a => a.method)
            let labelsType = x.map(a => a.content_type)
            let labelsISP = x.map(a => a.isp)
            let labelsDay = x.map(a => a.starteddatetime)
                //let waitTime = x.map(a => a.wait)
            let waitTime = x.map(function(e) {
                // var mins = e.wait / 60000;
                // var hrs = mins / 60;
                // var days = hrs / 24;
                return e.wait;
            });
            let methodsPost = new Object();
            let MethodsPost1 = x.map(function(e) {
                    if (e.method === 'POST') {

                    }
                })



                var waitMethods = {}; labelsMethods.forEach((key, i) => waitMethods[key] = waitTime[i]);
                //console.log(waitMethods);
                var labelsDayy = new Array();

                for (var i = 0; i <= labelsDay.length - 1; i++) {
                    y = new Date(labelsDay[i])
                    var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var whichday = day[y.getDay()]
                    labelsDayy.push(whichday)
                }
                //console.log(labelsDayy)

                var chartData = {
                    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',
                        '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'
                    ],
                    datasets: [{
                            type: 'bar',
                            label: 'Content-Type',
                            borderColor: 'blue',
                            borderWidth: 2,
                            fill: false,
                            data: labelsType


                        }, {
                            type: 'bar',
                            label: 'Day of the Week',
                            backgroundColor: 'red',
                            data: labelsDayy,
                            borderColor: 'white',
                            borderWidth: 2
                        },
                        {
                            type: 'bar',
                            label: 'ISP',
                            backgroundColor: 'yellow',
                            data: labelsDayy,
                            borderColor: 'white',
                            borderWidth: 2
                        },
                        {
                            type: 'bar',
                            label: 'HTTP Method',
                            backgroundColor: 'green',
                            data: labelsMethods
                        }
                    ]

                };

                var ctx = document.getElementById('myChart6').getContext('2d');
                var BarChart2 = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'bar',

                    // The data for our dataset
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Admin 2o Erwtima'
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: true
                            }
                        }

                    }
                    // Calculating bucket range
                    /* bucket_range = (Math.max.apply(null, valuesTTL) - Math.min.apply(null, valuesTTL)) / 10;
                         console.log(bucket_range)

                         var Combined = new Array();
                         Combined[0] = ['Content-Type', 'Time'];
                         for (var i = 0; i < labelsTTL.length; i++) {
                             Combined[i + 1] = [labelsTTL[i], valuesTTL[i]];
                         }



                    }) */
                })
            }

        }
        xhr.send();
    }
    document.addEventListener('DOMContentLoaded', ResponseTimes)