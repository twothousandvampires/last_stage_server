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
var Character_1 = require("../Objects/src/Character");
var Status_1 = require("./Status");
var ShockStatus = /** @class */ (function (_super) {
    __extends(ShockStatus, _super);
    function ShockStatus(time, duration, power) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.power = power;
        _this.last_checked = time;
        _this.need_to_check_resist = true;
        return _this;
    }
    ShockStatus.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.statusWasApplied();
            this.unit.shocked = true;
            this.unit.newStatus({
                name: 'zap',
                duration: this.duration,
                desc: 'you are shocked'
            });
        }
    };
    ShockStatus.prototype.clear = function () {
        this.unit.shocked = false;
    };
    ShockStatus.prototype.act = function (tick_time) {
        if (tick_time > this.last_checked) {
            this.last_checked += 500;
            if (!this.unit.zaped && Func_1.default.random() <= this.power) {
                var duration = Func_1.default.random(1, 1000);
                this.unit.setZap(duration);
            }
        }
    };
    return ShockStatus;
}(Status_1.default));
exports.default = ShockStatus;
