var testButton = document.getElementById("B");
var body = document.getElementsByTagName("body")[0];
var trials = document.getElementById("trials");
var explain = document.getElementById("explain");
var plotter = document.getElementById("plotter");

var limit = 50;
var enable = false,
    set = false,
    startTime = false;
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

function initialize() {
    set = false;
    startTime = false;
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
    fgenerate();
    trials.innerText = "Trial 1 of " + limit;
    explain.innerText = "Click mouse to set position";
    testButton.innerText = "Click";
}

function foperation() {
    if (testButton.innerText === "Start" || testButton.innerText === "Restart") {
        initialize();
    } else if (testButton.innerText === "Click") {
        fevaluate();
    } else {
        testButton.innerText = "Restart";
        testButton.style.left = 700;
        testButton.style.height = 50;
        testButton.style.width = 120;
        fplot();
    }
}

function fset() {
    if (enable && set) {
        enable = false;
        set = false;
        initialPositionX = parseInt(event.clientX);
        initialPositionY = parseInt(event.clientY);
        ti = Date.now();
        startTime = true;
        console.log(event.clientX, event.clientY);
        explain.innerText = "Move to click button when ready";
    }
    if (enable)
        set = true;
}

body.addEventListener('mousemove', (e) => {
    if (startTime && e != onclick) {
        ti = Date.now();
        console.log(ti);
        startTime = false;
    }
});

function fevaluate() {
    if (!enable) {
        finalPositionX = parseInt(testButton.style.left) + (parseInt(testButton.style.width) / 2.0);
        finalPositionY = parseInt(testButton.style.top) + (parseInt(testButton.style.height) / 2.0);

        distance = Math.sqrt((initialPositionX - finalPositionX) * (initialPositionX - finalPositionX) + (initialPositionY - finalPositionY) * (initialPositionY - finalPositionY));
        ID = Math.log2(2 * distance / parseInt(testButton.style.width));

        si = Date.now();

        console.log(initialPositionX, finalPositionX, initialPositionY, finalPositionY)
        console.log(distance, ti);

        if (Math.abs(initialPositionX - finalPositionX) <= parseInt(testButton.style.width) / 2.0 && Math.abs(initialPositionY - finalPositionY) <= parseInt(testButton.style.top) / 2.0) {
            startTime = false;
        } else {
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
        }

        n += 1;
        enable = true;

        if (n === limit) {
            trials.innerText = "";
            testButton.innerText = "Plot";
            enable = false;
        } else {
            trials.innerText = "Trial " + (n + 1) + " of " + limit;
            explain.innerText = "Click mouse to set position";
        }

        fgenerate();
    }
}

function fgenerate() {
    testButton.style.width = Math.floor(Math.random() * 161) + 40;
    testButton.style.height = Math.floor(Math.random() * 161) + 40;
    testButton.style.top = Math.floor(Math.random() * 351) + 150;
    testButton.style.left = Math.floor(Math.random() * 1251) + 25;
}

function fplot() {
    if (mn === mx || mn === Number.MAX_SAFE_INTEGER) {
        explain.innerText = "No valid input to represent";
        testButton.style.top = 200;
    } else {
        testButton.style.top = 600;
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
                text: 'MT = a + b.ID \n a = ' + a + ' millisecs,  b = ' + b + ' millisecs/bit',
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

        plotter.style.display = "block";
        Plotly.newPlot('plotter', data, layout);
    }

}
