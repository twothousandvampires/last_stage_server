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
var LightningBoltEffect_1 = require("../Objects/Effects/LightningBoltEffect");
var Status_1 = require("./Status");
var WithStormStatus = /** @class */ (function (_super) {
    __extends(WithStormStatus, _super);
    function WithStormStatus(time, duration, power) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.power = power;
        _this.last_checked = time;
        _this.name = 'with storm status';
        return _this;
    }
    WithStormStatus.prototype.apply = function (unit) {
        this.unit = unit;
    };
    WithStormStatus.prototype.update = function (status) {
        this.power++;
    };
    WithStormStatus.prototype.isExpired = function (tick_time) {
        return false;
    };
    WithStormStatus.prototype.act = function (tick_time) {
        if (tick_time > this.last_checked) {
            this.last_checked += 5000 - (this.power * 200);
            var check_distance = 20;
            var area_1 = this.unit.getBoxElipse();
            area_1.r = check_distance;
            var targets = this.unit.level.enemies.filter(function (elem) { return Func_1.default.elipseCollision(elem.getBoxElipse(), area_1); });
            var random_target = targets[Math.round(Math.random() * targets.length)];
            if (random_target) {
                var effect = new LightningBoltEffect_1.default(this.unit.level);
                effect.setPoint(random_target.x, random_target.y);
                this.unit.level.effects.push(effect);
                var hit_area_1 = {
                    x: random_target.x,
                    y: random_target.y,
                    r: 5
                };
                var targets_to_hit = this.unit.level.enemies.filter(function (elem) { return Func_1.default.elipseCollision(elem.getBoxElipse(), hit_area_1); });
                this.unit.level.addSound('lightning bolt', random_target.x, random_target.y);
                targets_to_hit.forEach(function (elem) {
                    var timer = Func_1.default.random(100, 2000);
                    elem.setZap(timer);
                });
            }
        }
    };
    return WithStormStatus;
}(Status_1.default));
exports.default = WithStormStatus;
