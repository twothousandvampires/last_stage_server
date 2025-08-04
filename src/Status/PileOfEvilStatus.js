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
var Status_1 = require("./Status");
var PileOfEvilStatus = /** @class */ (function (_super) {
    __extends(PileOfEvilStatus, _super);
    function PileOfEvilStatus(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.name = 'pile of evil status';
        return _this;
    }
    PileOfEvilStatus.prototype.apply = function (unit) {
        this.unit = unit;
        this.unit.move_speed += 0.2;
        this.unit.attack_speed -= 200;
        this.unit.armour_rate += 10;
    };
    PileOfEvilStatus.prototype.clear = function () {
        this.unit.move_speed -= 0.2;
        this.unit.attack_speed += 200;
        this.unit.armour_rate -= 10;
    };
    return PileOfEvilStatus;
}(Status_1.default));
exports.default = PileOfEvilStatus;
