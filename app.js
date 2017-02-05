/**
 * Created by mpicciolli on 06/01/2017.
 */
var samples = 200;
var speed = 100;
var values = [];
var labels = [];
var heartRatevalues = [];
var heartRatelabels = [];
var value = 0;
var freq = 0.10;
var interval = 100;
var timeElapsed = 0;
values.length = samples;
labels.length = samples;
values.fill(100);
labels.fill(0);
heartRatevalues.length = samples;
heartRatelabels.length = samples;
heartRatevalues.fill(0);
heartRatelabels.fill(0);

var statusText = document.querySelector('#statusText');

statusText.addEventListener('click', function() {
    statusText.textContent = 'Breathe...';
    heartRateSensor.connect()
        .then(() => {
            heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement);
            advance();
        })
        .catch(error => {
            statusText.textContent = error;
        });
});

function handleHeartRateMeasurement(heartRateMeasurement) {
    heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
        var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
        statusText.innerHTML = heartRateMeasurement.heartRate + ' &#x2764;';
        heartRatevalues.push(heartRateMeasurement.heartRate);
        heartRatevalues.shift();
        window.heartRateLine.update();
    });
}

function initialize() {
    window.breathLine = new Chart(document.getElementById("breathLine"), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                lineTension: 0.25,
                pointRadius: 0
            }]
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
                enabled: false
            },
            responsive: false,
            animation: {
                duration: speed * 1.5,
                easing: 'linear'
            },
            legend: false,
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    display: false,
                    ticks: {min: 0, max: 100}
                }]
            },
            annotation: {
                annotations: [{
                    id: 'a-line-1', // optional
                    type: 'line',
                    mode: 'vertical',
                    scaleID: 'y-axis-0',
                    value: '0',
                    borderColor: 'red',
                    borderWidth: 2,

                    // Fires when the user clicks this annotation on the chart
                    // (be sure to enable the event in the events array below).
                    onClick: function(e) {
                        // `this` is bound to the annotation element
                    }
                }],

                // Defines when the annotations are drawn.
                // This allows positioning of the annotation relative to the other
                // elements of the graph.
                //
                // Should be one of: afterDraw, afterDatasetsDraw, beforeDatasetsDraw
                // See http://www.chartjs.org/docs/#advanced-usage-creating-plugins
                drawTime: 'afterDraw', // (default)

                // Mouse events to enable on each annotation.
                // Should be an array of one or more browser-supported mouse events
                // See https://developer.mozilla.org/en-US/docs/Web/Events
                events: ['click'],

                // Double-click speed in ms used to distinguish single-clicks from
                // double-clicks whenever you need to capture both. When listening for
                // both click and dblclick, click events will be delayed by this
                // amount.
                dblClickSpeed: 350 // ms (default)
            }
        }
    });

    window.heartRateLine = new Chart(document.getElementById("heartRateLine"), {
        type: 'line',
        data: {
            labels: heartRatelabels,
            datasets: [{
                data: heartRatevalues,
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                lineTension: 0.25,
                pointRadius: 0
            }]
        },
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
                enabled: false
            },
            responsive: false,
            animation: {
                duration: speed * 1.5,
                easing: 'linear'
            },
            legend: false,
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    display: false,
                    ticks: {min: 0, max: 300}
                }]
            }
        }
    })
}


function advance() {
    value = Math.cos(2 * 3.141592 * freq * (timeElapsed / 1000)) * 50 + 50;
    values.push(value);
    values.shift();
    window.breathLine.update();
    timeElapsed = (timeElapsed + interval);
    setTimeout(function() {
        requestAnimationFrame(advance);
    }, speed);
}

window.onload = function() {
    initialize();
};