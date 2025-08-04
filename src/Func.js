"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Func = /** @class */ (function () {
    function Func() {
    }
    Func.angle = function (x, y, x1, y1) {
        var angle = Math.atan((x - x1) / (y - y1));
        if (x1 <= x && y1 <= y) {
            angle += Math.PI;
        }
        if (x1 >= x && y1 <= y) {
            angle += Math.PI;
        }
        if (x1 <= x && y1 >= y) {
            angle += Math.PI * 2;
        }
        return angle;
    };
    Func.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    Func.distance = function (one, two) {
        return Math.sqrt((Math.pow((one.x - two.x), 2)) + (Math.pow((one.y - two.y), 2)));
    };
    Func.elipseCollision = function (el, el2) {
        var unit_angle = Func.angle(el.x, el.y, el2.x, el2.y);
        var unit1_angle = Func.angle(el2.x, el2.y, el.x, el.y);
        var angle = Math.atan2((el.r / 2) * Math.cos(unit_angle), el.r * Math.sin(unit_angle));
        var d = Math.cos(angle) * el.r + el.x;
        var d2 = Math.sin(angle) * (el.r / 2) + el.y;
        var res = Math.pow((d - el2.x), 2) / Math.pow(el2.r, 2) + Math.pow((d2 - el2.y), 2) / Math.pow((el2.r / 2), 2) <= 1;
        if (res) {
            return res;
        }
        angle = Math.atan2((el2.r / 2) * Math.cos(unit1_angle), el2.r * Math.sin(unit1_angle));
        d = Math.cos(angle) * el2.r + el2.x;
        d2 = Math.sin(angle) * (el2.r / 2) + el2.y;
        res = Math.pow((d - el.x), 2) / Math.pow(el.r, 2) + Math.pow((d2 - el.y), 2) / Math.pow((el.r / 2), 2) <= 1;
        if (res) {
            return res;
        }
        if (el.x === el2.x && el.y === el2.y) {
            return true;
        }
        return false;
    };
    Func.checkAngle = function (one, two, angle, diff_check) {
        var a = Func.angle(one.x, one.y, two.x, two.y);
        var d = Math.abs(a - angle);
        if (d >= 3.24)
            d = 6.24 - d;
        return d <= diff_check / 2;
    };
    Func.isReactCollision = function (rect, rect2) {
        return (rect.y + rect.height > rect2.y) && (rect.y < rect2.y + rect2.height) &&
            (rect.x + rect.width > rect2.x) && (rect.x < rect2.x + rect2.width);
    };
    Func.pointInRect = function (x, y, rect) {
        return (x > rect.x
            && x < rect.x + rect.width
            && y > rect.y
            && y < rect.y + rect.height);
    };
    Func.random = function (min, max) {
        if (min === void 0) { min = 1; }
        if (max === void 0) { max = 100; }
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    Func.chance = function (chance) {
        return chance >= Func.random();
    };
    return Func;
}());
exports.default = Func;
