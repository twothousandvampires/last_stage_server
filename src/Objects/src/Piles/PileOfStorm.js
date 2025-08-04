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
var ShockStatus_1 = require("../../../Status/ShockStatus");
var Pile_1 = require("./Pile");
var PileOfStorm = /** @class */ (function (_super) {
    __extends(PileOfStorm, _super);
    function PileOfStorm(level) {
        var _this = _super.call(this, level) || this;
        _this.frequency = 3000;
        _this.getState();
        return _this;
    }
    PileOfStorm.prototype.castAct = function () {
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
                    var status_1 = new ShockStatus_1.default(elem.time, 4000, 25);
                    _this.level.setStatus(elem, status_1);
                }
            });
        }
    };
    return PileOfStorm;
}(Pile_1.default));
exports.default = PileOfStorm;
