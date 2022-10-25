var testButton = document.getElementById("B");

var enable = false, set = false;
var initialPositionX, initialPositionY;
var finalPositionX, finalPositionY;
var ti, si, distance, ID, MT;
var IDList = [], MTList = [];
var mn = 1000000, mx = -1000000;
var n = 0, x = 0, y = 0, xy = 0, xsrq = 0, a, b;
var points, line, data;

function foperation(){
    console.log(4356);
    if (testButton.innerText == "Start"){
        enable = true, set = true;
        fgenerate();
        testButton.innerText = "Click";
    } else if (testButton.innerText == "Click") {
        fevaluate();
    } else {
        testButton.style.visibility = 'hidden';
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
    }
    if (enable)
        set = true;
}

function fevaluate() {
    finalPositionX = parseInt(testButton.style.left) + (parseInt(testButton.style.width) / 2);
    finalPositionY = parseInt(testButton.style.top) + (parseInt(testButton.style.height) / 2);

    distance = Math.sqrt((initialPositionX - finalPositionX) * (initialPositionX - finalPositionX) + (initialPositionY - finalPositionY) * (initialPositionY - finalPositionY));
    ID =  Math.log2(2 * distance / parseInt(testButton.style.width));

    si = Date.now();
    MT = (si - ti) / 1000.0;

    IDList.push(ID);
    MTList.push(MT);

    if (!isNaN(distance)) {
        mn = Math.min(mn, ID);
        mx = Math.max(mx, ID);
        x += ID;
        y += MT;
        xy += ID * MT;
        xsrq += ID * ID;
        n += 1;
    }

    points = {
        x: IDList,
        y: MTList,
        mode: 'markers',
        type: 'scatter'
    };

    enable = true;
    
    if (n == 10){
        testButton.innerText = "Plot";
        enable = false;
    }
    
    fgenerate();
}

function fgenerate(){
    testButton.style.width = Math.floor(Math.random() * 151) + 50;
    testButton.style.height = Math.floor(Math.random() * 151) + 50;
    testButton.style.top = Math.floor(Math.random() * 451) + 50;
    testButton.style.left = Math.floor(Math.random() * 1251) + 50;
    testButton.style.background = 'teal';
    testButton.style.color = 'white';
    testButton.style.fontSize = '20px';
}

function fplot() {
    b = (n * xy - x * y) / (n * xsrq - x * x);
    a = (y - b * x) / n;
    mn = Math.min(mn, -1);
    mx = Math.max(mx, 4);
    
    line = {
        x: [mn, mx],
        y: [(b * mn + a), (b * mx + a)],
        mode: 'lines',
        type: 'scatter'
    };

    data = [points, line];
    Plotly.newPlot('plotDiv', data);
}
