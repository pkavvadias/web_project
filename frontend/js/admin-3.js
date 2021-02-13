function HTTPAnalysis() {

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:3000/headeranalysis", true);

    //xhr.setRequestHeader('Content-Type', 'json');
    xhr.responseType = 'json';

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var x = xhr.response;
            for (a in x) {
                x_new = x[a];
            }
            console.log(x_new)
            var labelsTTL = x_new.ttl.map(function(e) {
                return e.content_type;
            });
            var valuesTTL = x_new.ttl.map(function(e) {
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
                                max: 400,
                            }
                        }, {
                            display: true,
                            ticks: {
                                autoSkip: false,
                                max: 400,
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }


                /*var Combined = new Array();
            Combined[0] = ['Content-Type', 'Time'];
            for (var i = 0; i < valuesTTL.length; i++) {
                Combined[i + 1] = [valuesTTL[i], labelsTTL[i]];
            }
            console.log([Combined])
            google.charts.load("current", { packages: ["corechart"] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable(Combined);


                var options = {
                    title: 'Content Type Histogram',
                    legend: { position: 'none' },
                    bar: { groupWidth: "100%" },
                    histogram: { maxNumBuckets: 10 }
                };

                var chart = new google.visualization.Histogram(document.getElementById('chart_div'));
                chart.draw(data, options);
            }

*/


            })

        }
    }
    xhr.send();
}




document.addEventListener('DOMContentLoaded', HTTPAnalysis);
//document.addEventListener('DOMContentLoaded', flow);