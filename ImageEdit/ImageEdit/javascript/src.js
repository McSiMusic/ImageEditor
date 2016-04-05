$(document).ready(function () {
    //CONSTANTS...
    var PANEL_WIDTH = 350;
    var MIN_PANEL_HEIGHT = 450;
    var MIN_CANVAS_WIDTH = 300;
    var MIN_PANEL_HEIGHT_OFFSET = 50;
    var BRIGHTNESS_MULTIPLIER_STEP_VALUE = 0.25;
    var BRIGHTNESS_MIN_MULTIPLIER_VALUE = 0.25;
    var BRIGHTNESS_MAX_MULTIPLIER_VALUE = 10;
    var MAX_CROP_MODE_CORNER_INTERACTION_AREA_WIDTH = 50;
    var MAX_CROP_MODE_CORNER_INTERACTION_AREA_HEIGHT = 50;
    var MIN_CROP_MODE_AREA_WIDTH = 20;
    var MIN_CROP_MODE_AREA_HEIGHT = 20;
    //...CONSTANTS

    //CANVAS CONTEXTS...
    var mainCanvasContext = $("#mainCanvas")[0].getContext("2d");
    var cropCanvas = $("#cropCanvas")[0];
    var cropCanvasContext = cropCanvas.getContext("2d");
    //...CANVAS CONTEXTS

    //IMAGES...
    var image;
    var cropImage;
    var imageScale;
    //...IMAGES

    //IMAGE RECTANGLES...
    var imageRectangle = new Rectangle();
    var canvasRectangle = new Rectangle();
    var cropRectangle = new Rectangle();
    //...IMAGE RECTANGLES

    //STATE...
    var isCropAreaModified = false;
    var isLeftCornerModified = false;
    var isCropModeActivated = false;
    //...STATE

    //IMAGE FILTER VARS...
    var isGrayscale = false;
    var brightnessMultiplier = 1;
    //...IMAGE FILTER VARS

    //IMPLEMENTATOIN...
    //RESIZE LOGIC...
    var changeCanvasSize = function () {
        var width = $(window).width() - PANEL_WIDTH;
        $("#canvas").width(width > MIN_CANVAS_WIDTH ? width : MIN_CANVAS_WIDTH);
        var clientHeight = $(window).height();
        var height = clientHeight > MIN_PANEL_HEIGHT ? clientHeight - MIN_PANEL_HEIGHT_OFFSET : MIN_PANEL_HEIGHT - MIN_PANEL_HEIGHT_OFFSET;

        $("#canvas").height(height);
        $("#panel").height(height);

        mainCanvasContext.canvas.width = $("#canvas").width();
        mainCanvasContext.canvas.height = $("#canvas").height();
        cropCanvasContext.canvas.width = $("#canvas").width();
        cropCanvasContext.canvas.height = $("#canvas").height();

        if (image) {
            onImageChange();
        }
    }


    $(window).resize(function () {
        changeCanvasSize();
    });

    $(window).load(function () {
        changeCanvasSize();
    });
    //...RESIZE LOGIC

    //CANVAS REFRESH...
    var onImageChange = function () {
        cropCanvasContext.clearRect(0, 0, cropCanvasContext.canvas.width, cropCanvasContext.canvas.height);
        mainCanvasContext.clearRect(0, 0, mainCanvasContext.canvas.width, mainCanvasContext.canvas.height);

        var oldScale = imageScale;
        var oldY = canvasRectangle.y;
        var oldX = canvasRectangle.x;

        var imgHeight = imageRectangle.height;
        var imgWidth = imageRectangle.width;
        var canvasHeight = mainCanvasContext.canvas.height;
        var canvasWidth = mainCanvasContext.canvas.width;
        var verticalScale = imgHeight / canvasHeight;
        var horizontalScale = imgWidth / canvasWidth;
        if (verticalScale > horizontalScale) {
            imageScale = verticalScale;
            canvasRectangle.x = (canvasWidth - imgWidth / verticalScale) / 2;
            canvasRectangle.y = 0;
        }
        else {

            imageScale = horizontalScale;
            canvasRectangle.x = 0;
            canvasRectangle.y = (canvasHeight - imgHeight / horizontalScale) / 2;

        }
        canvasRectangle.width = imgWidth / imageScale;
        canvasRectangle.height = imgHeight / imageScale;
        mainCanvasContext.drawImage(image, imageRectangle.x, imageRectangle.y, imageRectangle.width, imageRectangle.height,
                                         canvasRectangle.x, canvasRectangle.y, canvasRectangle.width, canvasRectangle.height);

        if (isCropModeActivated) {
            if (cropRectangle.isNull()) {
                cropRectangle.x = canvasRectangle.x;
                cropRectangle.y = canvasRectangle.y;
                cropRectangle.width = canvasRectangle.width;
                cropRectangle.height = canvasRectangle.height;
            }
            else {
                var scaleRatio = oldScale / imageScale;
                cropRectangle.multiplyDimensions(scaleRatio);
                cropRectangle.x = canvasRectangle.x + ((cropRectangle.x - oldX) * scaleRatio);
                cropRectangle.y = canvasRectangle.y + ((cropRectangle.y - oldY) * scaleRatio);
            }
            cropCanvasContext.drawImage(cropImage, cropRectangle.x, cropRectangle.y, cropRectangle.width, cropRectangle.height);
        }
        updateBrightness();
    }
    //...CANVAS REFRESH

    //BUTTONS HANDLERS...
    $("#openbutton").change(function (event) {
        if (window.File && window.FileReader) {
            if (event.target.files[0]) {
                mainCanvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                image = new Image();
                image.onload = function () {
                    imageRectangle.x = 0;
                    imageRectangle.y = 0;
                    imageRectangle.width = image.width;
                    imageRectangle.height = image.height;
                    onImageChange();
                }

                image.src = URL.createObjectURL(event.target.files[0]);
                setButtonsDisabled(false);
            }
        }
        else {
            alert('The File APIs are not fully supported in this browser.');
        }
    });

    $("#cropButton").click(function (event) {
        isCropModeActivated = !isCropModeActivated;
        setButtonsDisabled(isCropModeActivated);

        if (isCropModeActivated) {
            cropCanvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            if (!cropImage) {
                cropRectangle = new Rectangle(0, 0, 0, 0);
                cropImage = new Image();
                cropImage.onload = function () {
                    if (image) {
                        onImageChange();
                    }
                }
            }
            else {
                onImageChange();
            }
            cropImage.src = "cropImage.png";
            $("#cropCanvas").show();
            $("#applyCropButton").prop("disabled", false);
            $("#cropButton").prop("disabled", false);
            $("#cropButton").prop("value", "Cancel crop");
        }
        else {
            $("#cropCanvas").hide();
            $("#applyCropButton").prop("disabled", true);
            $("#cropButton").prop("value", "Crop");
        }
    });


    $("#applyCropButton").click(function () {
        imageRectangle.width = cropRectangle.width * imageScale;
        imageRectangle.height = cropRectangle.height * imageScale;
        imageRectangle.x += (cropRectangle.x - canvasRectangle.x) * imageScale;
        imageRectangle.y += (cropRectangle.y - canvasRectangle.y) * imageScale;
        $("#cropCanvas").hide();
        $("#applyCropButton").prop("disabled", true);
        $("#cropButton").prop("value", "Crop");
        setButtonsDisabled(false);
        cropRectangle = new Rectangle();
        isCropModeActivated = false;
        onImageChange();
    });

    $("#grayscaleButton").click(function () {
        isGrayscale = !isGrayscale;
        $("#grayscaleButton").prop("value", isGrayscale ? "Colorize" : "Grayscale");
        onImageChange();
    });

    $("#reduceBrightnessButton").click(function () {
        brightnessMultiplier -= BRIGHTNESS_MULTIPLIER_STEP_VALUE;
        checkBrightnessValue();
        onImageChange();
    });

    $("#increaseBrightnessButton").click(function () {
        brightnessMultiplier += BRIGHTNESS_MULTIPLIER_STEP_VALUE;
        checkBrightnessValue();
        onImageChange();
    });

    $("#uploadButton").click(function () {
        setButtonsDisabled(true);

        var imageData = mainCanvasContext.getImageData(canvasRectangle.x, canvasRectangle.y, canvasRectangle.width, canvasRectangle.height);

        var newCanvas = document.createElement("canvas");
        newCanvas.id = "tmpCanvas";
        newCanvas.width = canvasRectangle.width;
        newCanvas.height = canvasRectangle.height;

        newCanvas.getContext("2d").putImageData(imageData, 0, 0);

        var canvasBytes = newCanvas.toDataURL("image/png");
        canvasBytes = canvasBytes.replace(/^data:image\/(png|jpg);base64,/, "")
        $.ajax({
            type: 'POST',
            url: 'Default.aspx/UploadPic',
            data: '{ "imageData" : "' + canvasBytes + '" }',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (msg) {
                setButtonsDisabled(false);
                alert("Done, Picture Uploaded");
            },
            error: function (msg) {
                alert('Upload Error');
            }
        });
    });

    //all buttons without apply crop
    var setButtonsDisabled = function (isDisabled) {
        $("#openbutton").prop("disabled", isDisabled);
        $("#cropButton").prop("disabled", isDisabled);
        $("#grayscaleButton").prop("disabled", isDisabled);
        $("#reduceBrightnessButton").prop("disabled", isDisabled);
        $("#increaseBrightnessButton").prop("disabled", isDisabled);
        $("#uploadButton").prop("disabled", isDisabled);
    }
    //BUTTONS HANDLERS...

    //CROP LOGIC...
    $("#cropCanvas").mousedown(function (event) {
        var parentOffset = $(this).offset();
        var mouseX = event.pageX - parentOffset.left;
        var mouseY = event.pageY - parentOffset.top;
        if (isLeftCropPointArea(mouseX, mouseY)) {
            isCropAreaModified = true;
            isLeftCornerModified = true;
        }
        if (isRightCropPointArea(mouseX, mouseY)) {
            isCropAreaModified = true;
            isLeftCornerModified = false;
        }
    });

    var isLeftCropPointArea = function (x, y) {
        return ((Math.abs(x - cropRectangle.x) < MAX_CROP_MODE_CORNER_INTERACTION_AREA_WIDTH) && (Math.abs(y - cropRectangle.y) < MAX_CROP_MODE_CORNER_INTERACTION_AREA_HEIGHT))
    }

    var isRightCropPointArea = function (x, y) {
        return ((Math.abs(x - cropRectangle.getRightX()) < MAX_CROP_MODE_CORNER_INTERACTION_AREA_WIDTH) && (Math.abs(y - cropRectangle.getBottomY()) < MAX_CROP_MODE_CORNER_INTERACTION_AREA_HEIGHT))
    }



    $("#cropCanvas").mousemove(function (event) {
        if (isCropAreaModified) {
            var parentOffset = $(this).offset();
            var mouseX = event.pageX - parentOffset.left;
            var mouseY = event.pageY - parentOffset.top;

            if (isLeftCornerModified) {
                var newWidth = cropRectangle.width - (mouseX - cropRectangle.x);
                var newHeight = cropRectangle.height - (mouseY - cropRectangle.y);
                if (newHeight > MIN_CROP_MODE_AREA_HEIGHT && mouseY > canvasRectangle.y) {
                    cropRectangle.height = cropRectangle.height - (mouseY - cropRectangle.y);
                    cropRectangle.y = mouseY;
                }
                if (newWidth > MIN_CROP_MODE_AREA_WIDTH && mouseX > canvasRectangle.x) {
                    cropRectangle.width = cropRectangle.width - (mouseX - cropRectangle.x);
                    cropRectangle.x = mouseX;
                }

            }
            else if (mouseX < canvasRectangle.getRightX() && mouseY < canvasRectangle.getBottomY()) {
                var newWidth = mouseX - cropRectangle.x;
                var newHeight = mouseY - cropRectangle.y;

                cropRectangle.width = newWidth > MIN_CROP_MODE_AREA_WIDTH ? newWidth : cropRectangle.width;
                cropRectangle.height = newHeight > MIN_CROP_MODE_AREA_HEIGHT ? newHeight : cropRectangle.height;
            }
            onImageChange();
        }
    });

    $(window).mouseup(function () {
        isCropAreaModified = false;
    });

    var checkBrightnessValue = function () {
        $("#reduceBrightnessButton").prop("disabled", brightnessMultiplier <= BRIGHTNESS_MIN_MULTIPLIER_VALUE ? true : false);
        $("#increaseBrightnessButton").prop("disabled", brightnessMultiplier >= BRIGHTNESS_MAX_MULTIPLIER_VALUE ? true : false);
    }
    //...CROP LOGIC

    //GRAPHIC FILTERS...
    var updateBrightness = function () {
        if (isGrayscale || brightnessMultiplier !== 1) {
            var imageData = mainCanvasContext.getImageData(canvasRectangle.x, canvasRectangle.y, canvasRectangle.width, canvasRectangle.height);
            var data = imageData.data;

            for (var i = 0; i < data.length; i += 4) {
                if (isGrayscale) {
                    var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                    // red
                    data[i] = brightness;
                    // green
                    data[i + 1] = brightness;
                    // blue
                    data[i + 2] = brightness;
                }
                data[i] *= brightnessMultiplier;
                data[i + 1] *= brightnessMultiplier;
                data[i + 2] *= brightnessMultiplier;
                data[i] = data[i] > 255 ? 255 : data[i];
                data[i + 1] = data[i + 1] > 255 ? 255 : data[i + 1];
                data[i + 2] = data[i + 2] > 255 ? 255 : data[i + 2];
            }

            mainCanvasContext.putImageData(imageData, canvasRectangle.x, canvasRectangle.y);
        }
    }
    //...GRAPHIC FILTERS
    //...IMPLEMENTATOIN
});