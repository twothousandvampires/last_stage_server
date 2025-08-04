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
var Character_1 = require("../Objects/src/Character");
var Status_1 = require("./Status");
var Blind = /** @class */ (function (_super) {
    __extends(Blind, _super);
    function Blind(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.need_to_check_resist = true;
        return _this;
    }
    Blind.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.statusWasApplied();
            this.unit.light_r -= 8;
            this.unit.newStatus({
                name: 'blind',
                duration: this.duration,
                desc: 'you are blinded'
            });
        }
    };
    Blind.prototype.clear = function () {
        this.unit.light_r += 8;
    };
    Blind.prototype.update = function (status) {
        this.time = Date.now();
        this.unit.newStatus({
            name: 'blind',
            duration: this.duration,
            desc: 'you are blinded'
        });
    };
    return Blind;
}(Status_1.default));
exports.default = Blind;
