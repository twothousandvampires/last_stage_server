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
var Poison = /** @class */ (function (_super) {
    __extends(Poison, _super);
    function Poison(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.name = 'poison';
        _this.need_to_check_resist = true;
        return _this;
    }
    Poison.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.can_regen_life = false;
            this.unit.statusWasApplied();
            this.unit.newStatus({
                name: 'poison',
                duration: this.duration,
                desc: 'poison'
            });
        }
    };
    Poison.prototype.clear = function () {
        if (this.unit instanceof Character_1.default) {
            this.unit.can_regen_life = true;
        }
    };
    return Poison;
}(Status_1.default));
exports.default = Poison;
