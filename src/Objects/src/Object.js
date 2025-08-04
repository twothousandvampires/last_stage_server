"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Object = /** @class */ (function () {
    function Object(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = 'object';
        this.move_speed = 0;
    }
    Object.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    };
    Object.prototype.addToPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (!this.x || !this.y)
            return;
        this.x += x;
        this.y += y;
    };
    return Object;
}());
exports.default = Object;
