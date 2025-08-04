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
var CommandsStatus = /** @class */ (function (_super) {
    __extends(CommandsStatus, _super);
    function CommandsStatus(time, duration, add_ms, add_armour) {
        if (add_ms === void 0) { add_ms = 0; }
        if (add_armour === void 0) { add_armour = 0; }
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.add_ms = add_ms;
        _this.add_armour = add_armour;
        return _this;
    }
    CommandsStatus.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.move_speed += this.add_ms;
            this.unit.armour_rate += this.add_armour;
            this.unit.newStatus({
                name: 'commands',
                duration: this.duration,
                desc: 'move speed and armour are increased'
            });
        }
    };
    CommandsStatus.prototype.clear = function () {
        if (this.unit instanceof Character_1.default) {
            this.unit.move_speed -= this.add_ms;
            this.unit.armour_rate -= this.add_armour;
        }
    };
    return CommandsStatus;
}(Status_1.default));
exports.default = CommandsStatus;
