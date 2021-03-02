function HTTPAnalysis() {

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:3000/headeranalysis", false);

    //xhr.setRequestHeader('Content-Type', 'json');
    // xhr.responseType = 'json';

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var x = xhr.response;
            var data = JSON.parse(x)
            var ttls = new Array();
            var percentages = new Array();
            var cache = new Array();
            //var labelsType = data.content_type.map(a => a.content_type)
            var labelsType = new Array();
            for (x in data) {
                for (y in data[x].ttl) {
                    ttlJSON = {
                        isp: x,
                        contentType: data[x].ttl[y].content_type,
                        time: data[x].ttl[y].time
                    }
                    ttls.push(ttlJSON)
                }
                for (y in data[x].percentages) {
                    percentagesJSON = {
                        isp: x,
                        contentType: data[x].percentages[y].content_type,
                        minfresh: data[x].percentages[y].minfresh,
                        maxstale: data[x].percentages[y].maxstale
                    }
                    percentages.push(percentagesJSON)
                }
                for (y in data[x].cache) {
                    cacheJSON = {
                        isp: x,
                        contentType: data[x].cache[y].content_type,
                        percentage: data[x].cache[y].percentage
                    }
                    cache.push(cacheJSON)
                }

            }

            var ttl_array = new Array();
            var isp_array = new Array();

            for (x in ttls) {
                ttl_array.push(ttls[x].contentType);
                isp_array.push(ttls[x].isp);
            }

            var ttl_array = [...new Set(ttl_array)]
            var isp_array = [...new Set(isp_array)]

            for (x in ttl_array) {
                selectTypes = document.getElementById("ctype");
                selectTypes_1 = document.getElementById("ctype_1")
                selectTypes_2 = document.getElementById("ctype_2")
                var opt = document.createElement("option");
                var opt_1 = document.createElement("option");
                var opt_2 = document.createElement("option");
                opt.text = ttl_array[x];
                opt_1.text = ttl_array[x];
                opt_2.text = ttl_array[x];
                selectTypes.add(opt);
                selectTypes_1.add(opt_1);
                selectTypes_2.add(opt_2);
            }
            for (x in isp_array) {
                selectTypes = document.getElementById("isp");
                selectTypes_1 = document.getElementById("isp_1");
                selectTypes_2 = document.getElementById("isp_2");
                var opt = document.createElement("option");
                var opt_1 = document.createElement("option");
                var opt_2 = document.createElement("option");
                opt.text = isp_array[x];
                opt_1.text = isp_array[x];
                opt_2.text = isp_array[x];
                selectTypes.add(opt);
                selectTypes_1.add(opt_1);
                selectTypes_2.add(opt_2);
            }

            var ctx = document.getElementById('myChart6').getContext('2d');
            var ctx_1 = document.getElementById('myChart7').getContext('2d');
            var ctx_2 = document.getElementById('myChart8').getContext('2d');

            var color = Chart.helpers.color;
            var config = {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'TTL Histogram',
                        backgroundColor: color('rgba(255, 0, 0, 0.6)').alpha(0.5).rgbString(),
                        borderColor: 'rgba(255, 0, 0, 0.6)',
                        borderWidth: 1,
                        data: [],

                    }]
                },
                options: {

                    scales: {
                        xAxes: [{
                            offset: true,
                            barPercentage: 1.0,
                            categoryPercentage: 1.0,
                            gridLines: {
                                offsetGridLines: false
                            }
                        }]
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'TTLs Histogram'
                        }
                    }



                }
            };

            var config_1 = {
                type: 'doughnut',
                data: {
                    labels: ['maxstale', 'minfresh', 'Without any'],
                    datasets: [{
                        label: 'Max-stale Min-fresh percentages',
                        backgroundColor: color('rgba(255, 0, 0, 0.6)').alpha(0.5).rgbString(),
                        borderColor: 'rgba(255, 0, 0, 0.6)',
                        borderWidth: 1,
                        data: [],

                    }]
                },
                options: {

                    scales: {
                        xAxes: [{
                            offset: true,
                            gridLines: {
                                offsetGridLines: false
                            }
                        }]
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Max-stale Min-fresh percentages'
                        }
                    }
                }
            }
            var config_2 = {
                type: 'doughnut',
                data: {
                    labels: ['cashable directives', 'Without any'],
                    datasets: [{
                        label: 'Cashable directives percentages',
                        backgroundColor: color('rgba(255, 0, 0, 0.6)').alpha(0.5).rgbString(),
                        borderColor: 'rgba(255, 0, 0, 0.6)',
                        borderWidth: 1,
                        data: [],

                    }]
                },
                options: {

                    scales: {
                        xAxes: [{
                            offset: true,
                            gridLines: {
                                offsetGridLines: false
                            }
                        }]
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Max-stale Min-fresh percentages'
                        }
                    }
                }
            }


            var chart_1 = new Chart(ctx, config);
            var chart_2 = new Chart(ctx_1, config_1);
            var chart_3 = new Chart(ctx_2, config_2);

            $('select').selectpicker();
            $('#ctype,#isp').on('changed.bs.select', function(e, clickedIndex, isSelected, previousValue) {
                var ctypeValues = $('#ctype').val();
                var ispValues = $('#isp').val();
                updateChart(chart_1, config, ttls, ctypeValues, ispValues);
            });

            $('#ctype_1,#isp_1').on('changed.bs.select', function(e, clickedIndex, isSelected, previousValue) {
                var ctypeValues = $('#ctype_1').val();
                var ispValues = $('#isp_1').val();
                updateChart_1(chart_2, config_1, percentages, ctypeValues, ispValues);
            });

            $('#ctype_2,#isp_2').on('changed.bs.select', function(e, clickedIndex, isSelected, previousValue) {
                var ctypeValues = $('#ctype_2').val();
                var ispValues = $('#isp_2').val();
                updateChart_2(chart_3, config_2, cache, ctypeValues, ispValues);
            });

        };
    }
    xhr.send();
}

function binning(data) {
    var new_data = new Array();
    for (x in data) {
        if (data[x].time < 0) {
            // new_data.push("0");
            new_data.push(data[x].time);
        } else {
            new_data.push(data[x].time);
        }
    }
    var min = Math.min(...new_data);
    var max = Math.max(...new_data);

    var step = Math.ceil((max - min) / 10);

    var ran = new Array();

    var ran = d3.range(min, max, step);

    var histGenerator = d3.bin()
        .domain([min, max]) // Set the domain to cover the entire intervall [min,max]
        .thresholds([ran[0], ran[1], ran[2], ran[3], ran[4], ran[5], ran[6], ran[7], ran[8], ran[9]]); // number of thresholds; this will create 10 bins
    // )

    var bins = histGenerator(new_data);

    var cool = new Array();

    for (let x in bins) {

        var JS = {
            x: bins[x].x0
        };

        cool.push(JS);

        delete bins[x]["x0"]
        delete bins[x]["x1"]
        if (bins[x].length == 0) {
            bins[x].push(0)
            bins[x].push(0)
        }

    }
    cool["10"] = { x: max };
    var JS = {
        x: cool,
        y: bins
    };
    return JS;
}

function updateChart(chart, config, dataset, ctype, isps) {
    const average = arr => arr.reduce((p, c) => parseFloat(p) + parseFloat(c), 0) / arr.length;
    var finaldata = new Array();
    if (ctype.length != 0 && isps.length != 0) {
        for (y in ctype) {
            for (x in dataset) {
                if (dataset[x].contentType == ctype[y]) {
                    for (k in isps) {
                        if (isps[k] == dataset[x].isp) {
                            finaldata.push(dataset[x])
                        }
                    }
                }
            }
        }

        var retur = binning(finaldata);
        var input = retur.y;
        var input_2 = new Array();
        var labelss = retur.x;
        for (x in input) {
            if (input[x].length != 0) {
                var JS = {
                    y: input[x].length
                };
                input_2[x] = JS;
            }
        }

        var input_3 = new Array();
        var labelss_1 = new Array();

        input_3 = input_2.map(function(e) {
            return e.y;
        });
        labelss_1 = labelss.map(function(e) {
            return e.x;
        });

        var newDataset = {
            label: 'TTL Histogram',
            backgroundColor: 'rgba(255, 0, 0, 0.3)',
            borderColor: 'rgba(255, 0, 0, 0.6)',
            hoverBackgroundColor: 'rgba(255, 0, 0, 0.9)',
            borderWidth: 1,
            data: input_3,
        };

        chart.data.labels = labelss_1;
        config.data.datasets.splice(0, 1); //remove old dataset
        config.data.datasets.push(newDataset);
        chart.update();


        var newdata = {
            labels: labelss,
            label: 'Response Time',
            data: input,
            backgroundColor: 'green',
            fill: false,
        }

        var newLabels = {
            labels: labelss
        }

        var newDataset = {
            label: 'Response Time',
            data: input,
            backgroundColor: 'green',
            fill: false,
        };

    } else {
        config.data.datasets.splice(0, 1);
        chart.update();
    }
}

function updateChart_1(chart, config_1, dataset, ctype, isps) {

    var finaldata = new Array();
    if (ctype.length != 0 && isps.length != 0) {
        for (y in ctype) {
            for (x in dataset) {
                if (dataset[x].contentType == ctype[y]) {
                    for (k in isps) {
                        if (isps[k] == dataset[x].isp) {
                            finaldata.push(dataset[x])
                        }
                    }
                }
            }
        }

        var max_data = new Array();
        var min_data = new Array();

        for (x in finaldata) {
            max_data.push(finaldata[x].maxstale);
            min_data.push(finaldata[x].minfresh);
        }



        var number_one = 0;
        var number_two = 0;

        for (x in max_data) {
            number_one = number_one + Number(max_data[x]);
        }

        for (x in min_data) {
            number_two = number_two + Number(min_data[x]);
        }

        // Dynamically assign colors
        var color1 = [];

        for (let x = 0; x < 2; x++) {
            color1.push(newColors());

        }


        var newDataset = {
            label: 'Max-stale, Min-stale to all Packages Percentages',
            backgroundColor: color1,
            borderColor: 'rgba(255, 0, 0, 0.6)',
            hoverBackgroundColor: 'rgba(255, 0, 0, 0.9)',
            borderWidth: 1,
            data: [number_one, number_two, (100 - number_one - number_two)],
        };

        config_1.data.datasets.splice(0, 1); //remove old dataset
        config_1.data.datasets.push(newDataset);
        chart.update();
    } else {
        config_1.data.datasets.splice(0, 1);
        chart.update();
    }
}

function updateChart_2(chart, config_2, dataset, ctype, isps) {

    var finaldata = new Array();
    if (ctype.length != 0 && isps.length != 0) {
        for (y in ctype) {
            for (x in dataset) {
                if (dataset[x].contentType == ctype[y]) {
                    for (k in isps) {
                        if (isps[k] == dataset[x].isp) {
                            finaldata.push(dataset[x])
                        }
                    }
                }
            }
        }

        var cache_data = new Array();

        for (x in finaldata) {
            cache_data.push(finaldata[x].percentage);
        }



        var number_cache = 0;

        for (x in cache_data) {
            number_cache = number_cache + Number(cache_data[x]);
        }

        // Dynamically assign colors
        var color1 = [];

        for (let x = 0; x < 2; x++) {
            color1.push(newColors());

        }


        var newDataset = {
            label: 'Cacheable to all Packages Percentages',
            backgroundColor: color1,
            borderColor: 'rgba(255, 0, 0, 0.6)',
            hoverBackgroundColor: 'rgba(255, 0, 0, 0.9)',
            borderWidth: 1,
            data: [number_cache, (100 - number_cache)],
        };

        config_2.data.datasets.splice(0, 1); //remove old dataset
        config_2.data.datasets.push(newDataset);
        chart.update();
    } else {
        config_2.data.datasets.splice(0, 1);
        chart.update();
    }
}

var newColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
};

document.addEventListener('DOMContentLoaded', HTTPAnalysis);