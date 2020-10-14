var ctx,
    brush,
    img,
    bSize,
    ratioContainer = document.getElementById('ratio-container'),
    content = document.getElementById('content'),
    canvas = document.getElementById("canvas"),
    touched = false,
    scratchIsOver = false,
    handlePercetangeAvailable = true,
    introCTA = document.getElementById('intro-cta'),
    screenCTA = document.getElementById('screen-2_image');

window.addEventListener('load', function () {
    setCanvasDim(canvas);
    setDivDim(ratioContainer);
    applyConfig();
    setTimeout(function(){
        screenCTA.style.opacity = 1;        
    }, 1000 );
});

window.addEventListener("resize", function () {
    setCanvasDim(canvas);
    setDivDim(ratioContainer);
});


function applyConfig() {
    if (config.customScratchCTA) {
        introCTA.style.backgroundImage = "url("+config.customScratchCTA+")";
        setTimeout(function(){
            introCTA.style.opacity = 0;
        }, 4000);
    }
    document.body.style.backgroundColor = config.backgroundColor;
    document.getElementById('canvas').style.borderColor = config.backgroundColor;
    if (config.landscapeRatioEnabled) {
        document.getElementById('screen-2_image').classList.add('landscape-enabled');
    }
}

function calcContainDim($width, $height, container) {
    var width, height;
    
    // landscape
    if (window.innerWidth > window.innerHeight && config.landscapeRatioEnabled) {
        width = $height;
        height = $width;
    }
    // portrait 
    else {
        width = $width;
        height = $height;
    }
    
    var computedStyle = getComputedStyle(container, null),
        cssSize = computedStyle.backgroundSize,
        elemW = parseInt(computedStyle.width.replace('px', ''), 10),
        elemH = parseInt(computedStyle.height.replace('px', ''), 10),
        elemDim = [elemW, elemH],
        computedDim = [],
        ratio = width / height;
        cssSize = cssSize.split(' ');    

    if (elemDim[0] / elemDim[1] >= ratio) {
        computedDim[0] = 'auto';
        computedDim[1] = elemDim[1];
    } else {
        computedDim[1] = 'auto';
        computedDim[0] = elemDim[0];
    }

    ratio = computedDim[0] === 'auto' ? height / computedDim[1] : width / computedDim[0];
    computedDim[0] = computedDim[0] === 'auto' ? width / ratio : computedDim[0];
    computedDim[1] = computedDim[1] === 'auto' ? height / ratio : computedDim[1];

    return computedDim;
};

function setCanvasDim(elem) {
    calcDim = calcContainDim(config.size.width, config.size.height, content);
    elem.width = calcDim[0];
    elem.height = calcDim[1];
    createCanvasContext();
};

function setDivDim(elem) {
    calcDim = calcContainDim(config.size.width, config.size.height, content);
    elem.style.width = calcDim[0]+"px";
    elem.style.height = calcDim[1]+"px";
}

function createCanvasContext() {    
    ctx = canvas.getContext('2d');
    brush = new Image();
    brush.src = './assets/brush.png';
    bSize = canvas.width / 3.2;
    img = new Image();
    img.src = selectImageFromOrientation();
    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        document.body.style.opacity = 1; // prevents FOUC
        scratch();
    };
}

function selectImageFromOrientation() {
    // landscape
    if (window.innerWidth > window.innerHeight && config.landscapeRatioEnabled) {
        return './assets/screen-1_image_landscape.jpg';
    }
    // portrait 
    else {
        return './assets/screen-1_image_portrait.jpg';
    }
}

function scratch() {
    canvas.addEventListener("mousemove", manageMouseMove);

    canvas.addEventListener("touchmove", manageTouchMove);

    canvas.addEventListener('touchend', manageTouchEnd);
}

function getBrushPos(xRef, yRef) {
    var canvasRect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((xRef - canvasRect.left) / (canvasRect.right - canvasRect.left) * canvas.width),
        y: Math.floor((yRef - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * canvas.height)
    };
}

function drawDot(mouseX, mouseY) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.drawImage(brush, mouseX - (bSize * 0.5), mouseY - (bSize * 0.5), bSize, bSize)
}

function manageMouseMove(ev) {
    introCTA.style.display = "none";
    var brushPos = getBrushPos(ev.clientX, ev.clientY);
    drawDot(brushPos.x, brushPos.y);

    if (!handlePercetangeAvailable) return;
    handlePercetangeAvailable = false;
    setTimeout(function () {
        handlePercetangeAvailable = true;
    }, 30);
    handlePercetange(getFilledInPixels(32));
}

function manageTouchMove(ev) {    
    introCTA.style.display = "none";
    ev.preventDefault();
    var touch = ev.targetTouches[0];
    if (touch) {
        var brushPos = getBrushPos(touch.pageX, touch.pageY);
        drawDot(brushPos.x, brushPos.y);
    }
    if (!touched) {
        sendTrackEvent('scratch', 'Scratching initiated');
        touched = true;
    }
    
    if (!handlePercetangeAvailable) return;
    handlePercetangeAvailable = false;
    setTimeout(function () {
        handlePercetangeAvailable = true;
    }, 30);
    handlePercetange(getFilledInPixels(32));
}

function manageTouchEnd() {     
    handlePercetange(getFilledInPixels(32));        
}

function getFilledInPixels(stride) {
    if (!stride || stride < 1) { stride = 1 }

    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height),
        pixelData = pixels.data,
        pixelNb = pixelData.length
    total = (pixelNb / stride),
        count = 0;

    for (var i = count = 0; i < pixelNb; i += stride) {
        if (parseInt(pixelData[i]) === 0) {
            count++;
        }
    }
    return Math.round((count / total) * 100);
}

function handlePercetange(filledInPixels) {
    if (scratchIsOver) return;
    filledInPixels = filledInPixels || 0;
    if (filledInPixels > 35) {
        scratchIsOver = true;
        canvas.classList.add('fadeOut');
        sendTrackEvent('scratch', 'End screen displayed');
    }
}