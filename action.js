var startButton = document.getElementById("S");
var testButton = document.getElementById("C");
var testButton1 = document.getElementById("T1");
var testButton2 = document.getElementById("T2");
var trials = document.getElementById("trials");
var explain = document.getElementById("explain");
var plotter = document.getElementById("plotter");
var container = document.getElementById("container");

var currTestButton1 = false,
    currTestButton2 = false;
var width = 0,
    pad = 0;
var limit = 15;
var enable = false;
var initialPositionX, initialPositionY;
var finalPositionX, finalPositionY;
var ti = NaN,
    si = NaN,
    distance, ID, MT;
var IDList = [],
    MTList = [];
var mn = Number.MAX_SAFE_INTEGER,
    mx = Number.MIN_SAFE_INTEGER;
var n = 0,
    x = 0,
    y = 0,
    xy = 0,
    xsrq = 0,
    a = 0,
    b = 0;
var points = NaN,
    line = NaN,
    data = NaN;

function finitialize() {
    currTestButton1 = true;
    ti = NaN;
    si = NaN;
    IDList = [];
    MTList = [];
    mn = Number.MAX_SAFE_INTEGER;
    mx = Number.MIN_SAFE_INTEGER;
    n = 0;
    x = 0;
    y = 0;
    xy = 0;
    xsrq = 0;
    a = 0;
    b = 0;
    points = NaN,
        line = NaN,
        data = NaN;

    plotter.style.display = "none";
    enable = true;

    testButton.style.display = "block";
    testButton1.style.display = "block";
    testButton2.style.display = "block";

    fgenerate();
    trials.innerText = "Trial 1 of " + limit;
    explain.innerText = "Click on the circle";
    startButton.style.display = "none";
    testButton.style.display = "block";
}

function foperation1() {
    if (currTestButton1 && !enable) {
        fevaluate(testButton1);
        currTestButton1 ^= true;
        currTestButton2 ^= true;
        testButton.style.background = "teal";
    }
}

function foperation2() {
    if (currTestButton2 && !enable) {
        fevaluate(testButton2);
        currTestButton1 ^= true;
        currTestButton2 ^= true;
        testButton.style.background = "teal";
    }
}

function fset() {
    if (enable) {
        enable = false;
        initialPositionX = parseInt(event.clientX);
        initialPositionY = parseInt(event.clientY);
        ti = Date.now();
        explain.innerText = "Click on the orange strip";
        testButton.style.background = "orange";
    }
}

function fevaluate(currTestButton) {
    if (!enable) {
        finalPositionX = parseInt(currTestButton.style.left) + (parseInt(currTestButton.style.width) / 2.0);
        finalPositionY = 400;

        distance = Math.sqrt((initialPositionX - finalPositionX) * (initialPositionX - finalPositionX) + (initialPositionY - finalPositionY) * (initialPositionY - finalPositionY));
        ID = Math.log2(2 * distance / width);

        si = Date.now();
        MT = si - ti;

        IDList.push(ID);
        MTList.push(MT);

        mn = Math.min(mn, ID);
        mx = Math.max(mx, ID);
        x += ID;
        y += MT;

        xy += ID * MT;
        xsrq += ID * ID;

        points = {
            x: IDList,
            y: MTList,
            mode: 'markers',
            name: 'Trials',
            type: 'scatter'
        };

        explain.innerText = "Click on the circle";
        enable = true;

        if (currTestButton1) {
            testButton1.style.background = "teal";
            testButton2.style.background = "orange";
        } else if (currTestButton2) {
            testButton1.style.background = "orange";
            testButton2.style.background = "teal";
        }

        if (currTestButton2) {
            n += 1;

            if (n === limit) {
                enable = false;
                fplot();
            } else {
                trials.innerText = "Trial " + (n + 1) + " of " + limit;
            }

            fgenerate();
        }
    }
}

function fgenerate() {
    width = Math.floor(Math.random() * 161) + 40;
    pad = Math.floor(Math.random() * (container.offsetWidth / 2 - 250)) + 25;
    testButton1.style.width = width;
    testButton2.style.width = width;
    testButton1.style.left = container.offsetWidth - pad - width;
    testButton2.style.left = pad;
}

function fplot() {
    trials.innerText = "";
    explain.innerText = "";
    startButton.style.display = "block";
    testButton.style.display = "none";
    testButton1.style.display = "none";
    testButton2.style.display = "none";

    if (mn === mx || mn === Number.MAX_SAFE_INTEGER) {
        explain.innerText = "No valid input to represent";
        startButton.style.top = 200;
    } else {
        b = (n * xy - x * y) / (n * xsrq - x * x);
        a = (y - b * x) / n;
        mn = Math.min(mn, -1);
        mx = Math.max(mx, 5);

        line = {
            x: [mn, mx],
            y: [(b * mn + a), (b * mx + a)],
            mode: 'lines',
            name: 'Regression line',
            type: 'scatter'
        };

        data = [points, line];

        var layout = {
            title: {
                text: 'MT = a + b⋅ID \n a = ' + a.toPrecision(5) + ' millisecs,  b = ' + b.toPrecision(5) + ' millisecs/bit',
                font: {
                    family: 'Courier New, monospace',
                    size: 24
                },
                xref: 'paper',
                x: 0.05,
            },
            xaxis: {
                title: {
                    text: 'Index of Difficulty (ID) in bits',
                    font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f'
                    }
                },
            },
            yaxis: {
                title: {
                    text: 'Movement Time (MT) in millisecs',
                    font: {
                        family: 'Courier New, monospace',
                        size: 18,
                        color: '#7f7f7f'
                    }
                }
            }
        }

        startButton.innerText = "Restart";

        plotter.style.display = "block";
        Plotly.newPlot('plotter', data, layout);
    }

}
