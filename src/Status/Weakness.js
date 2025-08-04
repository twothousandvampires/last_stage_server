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
var Weakness = /** @class */ (function (_super) {
    __extends(Weakness, _super);
    function Weakness(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.name = 'weakness';
        _this.need_to_check_resist = true;
        return _this;
    }
    Weakness.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.can_regen_resource = false;
            this.unit.statusWasApplied();
            this.unit.newStatus({
                name: 'weakness',
                duration: this.duration,
                desc: 'weakness'
            });
        }
    };
    Weakness.prototype.clear = function () {
        if (this.unit instanceof Character_1.default) {
            this.unit.can_regen_resource = true;
        }
    };
    Weakness.prototype.update = function (status) {
        this.time = Date.now();
        this.unit.newStatus({
            name: 'weakness',
            duration: status.duration,
            desc: 'weakness'
        });
    };
    return Weakness;
}(Status_1.default));
exports.default = Weakness;
