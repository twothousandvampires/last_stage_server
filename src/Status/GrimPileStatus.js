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
var GrimPileStatus = /** @class */ (function (_super) {
    __extends(GrimPileStatus, _super);
    function GrimPileStatus(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.name = 'grim pile status';
        _this.add_armour = 10;
        _this.add_speed = 0.1;
        _this.add_resistance = 0;
        return _this;
    }
    GrimPileStatus.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.armour_rate += this.add_armour;
            this.unit.move_speed += this.add_speed;
            this.unit.status_resistance += this.add_resistance;
        }
    };
    GrimPileStatus.prototype.clear = function () {
        if (this.unit instanceof Character_1.default) {
            this.unit.armour_rate -= this.add_armour;
            this.unit.move_speed -= this.add_speed;
            this.unit.status_resistance -= this.add_resistance;
        }
    };
    return GrimPileStatus;
}(Status_1.default));
exports.default = GrimPileStatus;
