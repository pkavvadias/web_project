





function HTTPAnalysis() {

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:3000/headeranalysis", true);

    //xhr.setRequestHeader('Content-Type', 'json');
    xhr.responseType = 'json';

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var x = xhr.response;
            var data = JSON.parse(x)
            var ttls = new Array();
            var percentages = new Array();
            var cache = new Array();
            //var labelsType = data.content_type.map(a => a.content_type)
            var labelsType = new Array();
            for (x in data) {
                for ( y in data[x].ttl){
                    TTLJSON = {
                        isp: x,
                        contentType: data[x].ttl[y].content_type,
                        time: data[x].ttl[y].time
                    }
                    ttls.push(TTLJSON)
                } 
                for ( y in data[x].percentages){
                    percentagesJSON = {
                        isp: x,
                        contentType: data[x].percentages[y].content_type,
                        minfresh: data[x].percentages[y].minfresh,
                        maxstale: data[x].percentages[y].maxstale
                    }
                    percentages.push(percentagesJSON)
                }
                for ( y in data[x].cache){
                    cacheJSON = {
                        isp: x,
                        contentType: data[x].cache[y].content_type,
                        percentage: data[x].cache[y].percentage
                    }
                    cache.push(cacheJSON)
                }  

            }
            var labelsType = [...new Set(labelsType)]
            var isps = [...new Set(isps)]
            
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

            var ctx = document.getElementById('myChart6').getContext('2d');
            var config = {
                type: 'line',
                data: {
                    labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
                        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
                    datasets: [{
                        label: 'Response Times Dataset',
                        data: [],
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Chart.js Line Chart'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        x: {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Hours'
                            }
                        },
                        y: {
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Response Times'
                            }
                        }
                    }
                }
            };
            window.myBar = new Chart(ctx, config);

            $('select').selectpicker();
            $('#ctype,#dates,#methods,#isp').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                var ctypeValues = $('#ctype').val();
                var datesValues = $('#dates').val();
                var methodsValues = $('#methods').val();
                var ispValues = $('#isp').val();
                updateChart(window.myBar, config, data, ctypeValues, datesValues, methodsValues, ispValues);
            });

        };
    }
    xhr.send();
}




document.addEventListener('DOMContentLoaded', HTTPAnalysis);
//document.addEventListener('DOMContentLoaded', flow);