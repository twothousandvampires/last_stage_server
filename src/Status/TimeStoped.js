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
var TimeStoped = /** @class */ (function (_super) {
    __extends(TimeStoped, _super);
    function TimeStoped(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        return _this;
    }
    TimeStoped.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.time_stopped = true;
            this.unit.can_regen_life = false;
            this.unit.can_regen_resource = false;
            this.unit.newStatus({
                name: 'time stoped',
                duration: this.duration,
                desc: 'time is stoped'
            });
        }
    };
    TimeStoped.prototype.clear = function () {
        this.unit.time_stopped = false;
        this.unit.can_regen_life = true;
        this.unit.can_regen_resource = true;
    };
    TimeStoped.prototype.update = function (status) {
    };
    return TimeStoped;
}(Status_1.default));
exports.default = TimeStoped;
