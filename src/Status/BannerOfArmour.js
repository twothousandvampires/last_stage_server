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
var BannerOfArmourEffect_1 = require("../Objects/Effects/BannerOfArmourEffect");
var BannerOfArmourStatus_1 = require("./BannerOfArmourStatus");
var Status_1 = require("./Status");
var BannerOfArmour = /** @class */ (function (_super) {
    __extends(BannerOfArmour, _super);
    function BannerOfArmour(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.radius = 10;
        _this.name = 'banner of armour';
        return _this;
    }
    BannerOfArmour.prototype.clear = function () {
        var _this = this;
        this.unit.level.deleted.push(this.effect.id);
        this.unit.level.bindedEffects = this.unit.level.bindedEffects.filter(function (elem) { return elem != _this.effect; });
    };
    BannerOfArmour.prototype.apply = function (unit) {
        this.unit = unit;
        var effect = new BannerOfArmourEffect_1.default(this.unit.level);
        effect.setOwner(this.unit);
        effect.setPoint(this.unit.x, this.unit.y);
        this.effect = effect;
        unit.level.bindedEffects.push(effect);
    };
    BannerOfArmour.prototype.isExpired = function (tick_time) {
        return false;
    };
    BannerOfArmour.prototype.act = function (tick_time) {
        var _this = this;
        if (tick_time > this.last_checked) {
            this.last_checked += 2000;
            var box_1 = this.unit.getBoxElipse();
            box_1.r = this.radius;
            this.unit.level.enemies.forEach(function (elem) {
                if (Func_1.default.elipseCollision(box_1, elem.getBoxElipse())) {
                    var status_1 = new BannerOfArmourStatus_1.default(tick_time, 4000);
                    _this.unit.level.setStatus(elem, status_1);
                }
            });
        }
    };
    return BannerOfArmour;
}(Status_1.default));
exports.default = BannerOfArmour;
