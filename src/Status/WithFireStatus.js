"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Func_1 = require("../Func");
var FlameWallObject_1 = require("../Objects/Projectiles/FlameWallObject");
var Status_1 = require("./Status");
var WithFireStatus = /** @class */ (function (_super) {
    __extends(WithFireStatus, _super);
    function WithFireStatus(time, duration, power) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.power = power;
        _this.last_checked = time;
        _this.name = 'with fire status';
        return _this;
    }
    WithFireStatus.prototype.apply = function (unit) {
        this.unit = unit;
    };
    WithFireStatus.prototype.update = function (status) {
        this.power++;
    };
    WithFireStatus.prototype.isExpired = function (tick_time) {
        return false;
    };
    WithFireStatus.prototype.act = function (tick_time) {
        if (tick_time > this.last_checked) {
            this.last_checked += 5000 - (this.power * 200);
            var distance = Func_1.default.random(10, 20);
            var fire = new FlameWallObject_1.FlameWallObject(this.unit.level);
            fire.setOwner(this.unit);
            var angle = Math.random() * 6.28;
            fire.setPoint(this.unit.x + Math.sin(angle) * distance, this.unit.y + Math.sin(angle) * distance);
            this.unit.level.projectiles.push(fire);
        }
    };
    return WithFireStatus;
}(Status_1.default));
exports.default = WithFireStatus;
