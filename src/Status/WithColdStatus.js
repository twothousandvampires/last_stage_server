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
var FrostExplosionBig_1 = require("../Objects/Effects/FrostExplosionBig");
var Status_1 = require("./Status");
var WithColdStatus = /** @class */ (function (_super) {
    __extends(WithColdStatus, _super);
    function WithColdStatus(time, duration, power) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.power = power;
        _this.last_checked = time;
        _this.name = 'with cold status';
        return _this;
    }
    WithColdStatus.prototype.apply = function (unit) {
        this.unit = unit;
    };
    WithColdStatus.prototype.update = function (status) {
        this.power++;
    };
    WithColdStatus.prototype.isExpired = function (tick_time) {
        return false;
    };
    WithColdStatus.prototype.act = function (tick_time) {
        var _this = this;
        if (tick_time > this.last_checked) {
            this.last_checked += 5000;
            var distance = Func_1.default.random(10, 20);
            var angle = Math.random() * 6.28;
            var point_1 = {
                x: this.unit.x + Math.sin(angle) * distance,
                y: this.unit.y + Math.sin(angle) * distance,
                r: 3 + this.power
            };
            var e = new FrostExplosionBig_1.default(this.unit.level);
            e.setPoint(point_1.x, point_1.y);
            this.unit.level.effects.push(e);
            var enemies = this.unit.level.enemies;
            var players = this.unit.level.players;
            enemies.forEach(function (elem) {
                if (Func_1.default.elipseCollision(point_1, elem.getBoxElipse())) {
                    elem.setFreeze(1500);
                }
            });
            players.forEach(function (elem) {
                if (elem != _this.unit && Func_1.default.elipseCollision(point_1, elem.getBoxElipse())) {
                    elem.setFreeze(1500);
                }
            });
        }
    };
    return WithColdStatus;
}(Status_1.default));
exports.default = WithColdStatus;
