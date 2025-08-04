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
var CursedWeaponStatus = /** @class */ (function (_super) {
    __extends(CursedWeaponStatus, _super);
    function CursedWeaponStatus(time, duration, drinker) {
        if (drinker === void 0) { drinker = false; }
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.drinker = drinker;
        return _this;
    }
    CursedWeaponStatus.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.attack_radius += 4;
            this.unit.attack_speed -= 500;
            this.unit.newStatus({
                name: 'cursed weapon',
                duration: this.duration,
                desc: 'your weapon is cursed'
            });
            if (this.drinker) {
                this.unit.onKillTriggers.push(this);
            }
        }
    };
    CursedWeaponStatus.prototype.trigger = function () {
        if (Func_1.default.chance(10)) {
            this.unit.addLife();
        }
    };
    CursedWeaponStatus.prototype.clear = function () {
        var _this = this;
        if (this.unit instanceof Character_1.default) {
            this.unit.attack_radius -= 4;
            this.unit.attack_speed += 500;
            if (this.unit.getSecondResource() * 10 < Func_1.default.random()) {
                this.unit.takePureDamage();
            }
            if (this.drinker) {
                this.unit.onKillTriggers = this.unit.onKillTriggers.filter(function (elem) { return elem != _this; });
            }
        }
    };
    return CursedWeaponStatus;
}(Status_1.default));
exports.default = CursedWeaponStatus;
