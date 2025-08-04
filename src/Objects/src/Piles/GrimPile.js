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
var Func_1 = require("../../../Func");
var GrimPileStatus_1 = require("../../../Status/GrimPileStatus");
var Pile_1 = require("./Pile");
var GrimPile = /** @class */ (function (_super) {
    __extends(GrimPile, _super);
    function GrimPile(level) {
        var _this = _super.call(this, level) || this;
        _this.frequency = 2000;
        _this.increased_effect = false;
        _this.resistance = false;
        _this.getState();
        return _this;
    }
    GrimPile.prototype.castAct = function () {
        var _this = this;
        if (this.action && !this.hit) {
            this.hit = true;
            this.level.sounds.push({
                name: 'dark cast',
                x: this.x,
                y: this.y
            });
            var e_1 = this.getBoxElipse();
            e_1.r = 15;
            this.level.players.forEach(function (elem) {
                if (Func_1.default.elipseCollision(e_1, elem.getBoxElipse())) {
                    var status_1 = new GrimPileStatus_1.default(elem.time, 2000);
                    if (_this.increased_effect) {
                        status_1.add_armour += 10;
                        status_1.add_speed += 0.1;
                    }
                    if (_this.resistance) {
                        status_1.add_resistance += 15;
                    }
                    _this.level.setStatus(elem, status_1, true);
                }
            });
        }
    };
    return GrimPile;
}(Pile_1.default));
exports.default = GrimPile;
