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
var FrostNova_1 = require("../Objects/Effects/FrostNova");
var Item_1 = require("./Item");
var GlacialChain = /** @class */ (function (_super) {
    __extends(GlacialChain, _super);
    function GlacialChain() {
        var _this = _super.call(this) || this;
        _this.chance = 20;
        _this.forge_power = 0;
        return _this;
    }
    GlacialChain.prototype.canBeForged = function (character) {
        return this.forge_power < 3;
    };
    GlacialChain.prototype.forge = function (character) {
        this.forge_power++;
    };
    GlacialChain.prototype.equip = function (character) {
        character.useNotUtilityTriggers.push(this);
    };
    GlacialChain.prototype.trigger = function (character) {
        if (Func_1.default.chance(this.chance + (this.forge_power * 5))) {
            var effect = new FrostNova_1.default(character.level);
            effect.setPoint(character.x, character.y);
            character.level.effects.push(effect);
            var targets = character.level.enemies.concat(character.level.players.filter(function (elem) { return elem != character; }));
            var box = character.getBoxElipse();
            box.r = 12 + (this.forge_power * 2);
            for (var i = 0; i < targets.length; i++) {
                var target = targets[i];
                if (Func_1.default.elipseCollision(box, target.getBoxElipse())) {
                    target.setFreeze(2000);
                }
            }
        }
    };
    return GlacialChain;
}(Item_1.default));
exports.default = GlacialChain;
