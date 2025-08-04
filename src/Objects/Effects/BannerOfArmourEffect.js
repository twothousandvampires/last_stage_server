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
var Effects_js_1 = require("./Effects.js");
var BannerOfArmourEffect = /** @class */ (function (_super) {
    __extends(BannerOfArmourEffect, _super);
    function BannerOfArmourEffect(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'banner of armour';
        _this.x = undefined;
        _this.y = undefined;
        return _this;
    }
    BannerOfArmourEffect.prototype.act = function () {
        if (!this.owner) {
            return;
        }
        this.x = this.owner.x;
        this.y = this.owner.y;
    };
    BannerOfArmourEffect.prototype.setOwner = function (unit) {
        this.owner = unit;
    };
    return BannerOfArmourEffect;
}(Effects_js_1.default));
exports.default = BannerOfArmourEffect;
