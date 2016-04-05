<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>
<!DOCTYPE html>
<head>
    <script type="text/javascript" src="static/js/jquery-1.12.2.min.js"></script>
    <script type="text/javascript" src="javascript/rectangle.js"></script>
    <script type="text/javascript" src="javascript/src.js"></script>
    <link rel="stylesheet" type="text/css" href="static/css/style.css"/>
    <title>Edit Image</title>
</head>
<body>
    <div id="canvas" class = "canvas-panel">
        <canvas id="mainCanvas" style="position: absolute; z-index: 1;"></canvas>
        <canvas id="cropCanvas" style="position: absolute; z-index: 2;"></canvas>
    </div> 
    <div id="panel" class = "buttons-panel">
        <input id ="openbutton" type="file" accept="image/*" class = "button"><br /><br />
        <input id ="cropButton" type="submit" value="Crop" disabled="true" class = "button"><br />
        <input id ="applyCropButton" type="submit" value="Apply crop" disabled="true" class = "button"><br /><br />
        <div class = "label">Effects</div><br />
        <input id ="grayscaleButton" type="submit" value="Grayscale" disabled="true" class = "button"><br />
        <input id ="reduceBrightnessButton" disabled="true" type="submit" value="-">
        <div class = "label">Brightness</div>
        <input id ="increaseBrightnessButton" disabled="true" type="submit" value="+"><br /><br /><br />
        <input id ="uploadButton" type="submit" value="Upload" disabled="true" class = "button">
    </div>
</body>
