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
var Blood_1 = require("../Objects/Effects/Blood");
var Character_1 = require("../Objects/src/Character");
var Status_1 = require("./Status");
var Bleed = /** @class */ (function (_super) {
    __extends(Bleed, _super);
    function Bleed(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.need_to_check_resist = true;
        return _this;
    }
    Bleed.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.statusWasApplied();
            this.unit.newStatus({
                name: 'bleed',
                duration: this.duration,
                desc: 'you are bleeded'
            });
        }
    };
    Bleed.prototype.act = function (tick_time) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1000;
            if (this.unit.is_moving) {
                this.unit.takePureDamage();
                var e = new Blood_1.default(this.unit.level);
                e.setPoint(Func_1.default.random(this.unit.x - 2, this.unit.x + 2), this.unit.y);
                e.z = Func_1.default.random(2, 8);
                this.unit.level.effects.push(e);
            }
        }
    };
    return Bleed;
}(Status_1.default));
exports.default = Bleed;
