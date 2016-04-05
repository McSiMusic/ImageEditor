var Rectangle = function (aX, aY, aWidth, aHeight) {
    this.x = aX || 0;
    this.y = aY || 0;
    this.width = aWidth || 0;
    this.height = aHeight || 0;
    this.isNull = function () {
        return !(this.x || this.y || this.width || this.height);
    }
    this.multiplyDimensions = function (multiplier) {
        this.width = this.width * multiplier;
        this.height = this.height * multiplier;
    }
    this.getRightX = function () {
        return this.x + this.width;
    }
    this.getBottomY = function () {
        return this.y + this.height;
    }
}