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
var BannerOfArmourStatus = /** @class */ (function (_super) {
    __extends(BannerOfArmourStatus, _super);
    function BannerOfArmourStatus(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        return _this;
    }
    BannerOfArmourStatus.prototype.apply = function (unit) {
        this.unit = unit;
        unit.armour_rate += 15;
    };
    BannerOfArmourStatus.prototype.clear = function () {
        this.unit.armour_rate -= 15;
    };
    return BannerOfArmourStatus;
}(Status_1.default));
exports.default = BannerOfArmourStatus;
