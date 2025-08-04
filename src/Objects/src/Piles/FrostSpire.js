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
var FrostExplosionMedium_1 = require("../../Effects/FrostExplosionMedium");
var FrostNova_1 = require("../../Effects/FrostNova");
var Pile_1 = require("./Pile");
var FrostSpire = /** @class */ (function (_super) {
    __extends(FrostSpire, _super);
    function FrostSpire(level) {
        var _this = _super.call(this, level) || this;
        _this.frequency = 3000;
        _this.life_status = 1;
        _this.name = 'frost spire';
        _this.getState();
        return _this;
    }
    FrostSpire.prototype.setDyingAct = function () {
        this.state = 'dying';
        this.stateAct = this.DyingAct;
        this.setTimerToGetState(this.dying_time);
        if (this.life_status <= 0) {
            var effect = new FrostExplosionMedium_1.default(this.level);
            effect.setPoint(this.x, this.y);
            this.level.effects.push(effect);
            var e_1 = this.getBoxElipse();
            e_1.r = 6;
            this.level.enemies.forEach(function (elem) {
                if (Func_1.default.elipseCollision(e_1, elem.getBoxElipse())) {
                    elem.takeDamage();
                }
            });
            this.level.players.forEach(function (elem) {
                if (Func_1.default.elipseCollision(e_1, elem.getBoxElipse())) {
                    elem.takeDamage();
                }
            });
        }
    };
    FrostSpire.prototype.castAct = function () {
        if (this.action && !this.hit) {
            this.hit = true;
            var e_2 = this.getBoxElipse();
            e_2.r = 8;
            var effect = new FrostNova_1.default(this.level);
            effect.setPoint(this.x, this.y);
            this.level.effects.push(effect);
            this.level.enemies.forEach(function (elem) {
                if (Func_1.default.elipseCollision(e_2, elem.getBoxElipse())) {
                    elem.setFreeze(1000);
                }
            });
            this.level.players.forEach(function (elem) {
                if (Func_1.default.elipseCollision(e_2, elem.getBoxElipse())) {
                    elem.setFreeze(1000);
                }
            });
        }
    };
    return FrostSpire;
}(Pile_1.default));
exports.default = FrostSpire;
