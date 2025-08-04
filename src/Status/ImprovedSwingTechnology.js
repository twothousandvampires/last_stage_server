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
var ImprovedSwingTechnology = /** @class */ (function (_super) {
    __extends(ImprovedSwingTechnology, _super);
    function ImprovedSwingTechnology(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.name = 'improved swing technology';
        _this.max_stack = 5;
        _this.stack_count = 1;
        return _this;
    }
    ImprovedSwingTechnology.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.stack_count = 1;
            this.unit.move_speed += 0.1;
            this.unit.attack_speed -= 100;
        }
    };
    ImprovedSwingTechnology.prototype.clear = function () {
        if (this.unit instanceof Character_1.default) {
            this.unit.move_speed -= 0.1 * this.stack_count;
            this.unit.attack_speed += 100 * this.stack_count;
        }
    };
    ImprovedSwingTechnology.prototype.update = function (status) {
        this.time = Date.now();
        if (this.stack_count < this.max_stack) {
            this.stack_count++;
            this.unit.move_speed += 0.1;
            this.unit.attack_speed -= 100;
        }
    };
    return ImprovedSwingTechnology;
}(Status_1.default));
exports.default = ImprovedSwingTechnology;
