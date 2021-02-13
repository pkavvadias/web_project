
function ResponseTime() {

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
    //document.addEventListener('DOMContentLoaded', ResponseTimes)
    document.addEventListener('DOMContentLoaded', ResponseTimes)

function ResponseTimes() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:3000/getresponsetimes", false);

    //xhr.setRequestHeader('Content-Type', 'json');
    //xhr.responseType = 'json';

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var x = xhr.response;
            var data = JSON.parse(x)
            console.log(data)
            //var labelsType = data.content_type.map(a => a.content_type)
            var labelsType = new Array();
            var days = new Array();
            var isps = new Array();
            var methods = new Array();
            for (x in data) {
                labelsType.push(data[x].content_type)
                y = new Date(data[x].starteddatetime)
                var day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var whichday = day[y.getDay()]
                days.push(whichday)
                isps.push(data[x].isp)
                methods.push(data[x].method)
            }
            var labelsType = [...new Set(labelsType)]
            var days = [...new Set(days)]
            var isps = [...new Set(isps)]
            var methods = [...new Set(methods)]
            for (x in labelsType) {
                selectTypes = document.getElementById("ctype");
                var opt = document.createElement("option");
                opt.text = labelsType[x];
                selectTypes.add(opt);
            }
            for (x in days) {
                selectTypes = document.getElementById("dates");
                var opt = document.createElement("option");
                opt.text = days[x];
                selectTypes.add(opt);
            }
            for (x in isps) {
                selectTypes = document.getElementById("isp");
                var opt = document.createElement("option");
                opt.text = isps[x];
                selectTypes.add(opt);
            }
            for (x in methods) {
                selectTypes = document.getElementById("methods");
                var opt = document.createElement("option");
                opt.text = methods[x];
                selectTypes.add(opt);
            }            
            var color = Chart.helpers.color;
            var barChartData = {
                labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
                    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
                datasets: []
            };
            var ctx = document.getElementById('myChart6').getContext('2d');
            window.myBar = new Chart(ctx, {
                type: 'bar',
                data: barChartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                }
                            }]
                        },
                        title: {
                            display: true,
                            text: 'Response Times'
                        }
                    }
                }
            });
            $('select').selectpicker();
            $('#ctype,#dates,#methods,#isp').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                var ctypeValues = $('#ctype').val();
                var datesValues = $('#dates').val();
                var methodsValues = $('#methods').val();
                var ispValues = $('#isps').val();
                updateChart(window.mybar,barChartData,data, ctypeValues, datesValues, methodsValues, ispValues);
            });

        };

    };

    xhr.send();
}

function updateChart(chart,data,dataset,ctype,dates,methods,isps){
    
}