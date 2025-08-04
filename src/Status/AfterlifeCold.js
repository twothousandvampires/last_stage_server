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
var Status_1 = require("./Status");
var AfterlifeCold = /** @class */ (function (_super) {
    __extends(AfterlifeCold, _super);
    function AfterlifeCold(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        return _this;
    }
    AfterlifeCold.prototype.apply = function (unit) {
        this.unit = unit;
    };
    AfterlifeCold.prototype.act = function (tick_time) {
        var _this = this;
        if (tick_time > this.last_checked) {
            this.last_checked += 300;
            this.unit.level.enemies.forEach(function (elem) {
                if (Func_1.default.elipseCollision(elem.getBoxElipse(), _this.unit.getBoxElipse())) {
                    elem.setFreeze(2000);
                }
            });
        }
    };
    return AfterlifeCold;
}(Status_1.default));
exports.default = AfterlifeCold;
