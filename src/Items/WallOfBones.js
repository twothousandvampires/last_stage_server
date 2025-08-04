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
var BoneArmour_1 = require("../Objects/Effects/BoneArmour");
var BoneArmourExplosion_1 = require("../Objects/Effects/BoneArmourExplosion");
var Item_1 = require("./Item");
var WallOfBones = /** @class */ (function (_super) {
    __extends(WallOfBones, _super);
    function WallOfBones() {
        var _this = _super.call(this) || this;
        _this.max_stacks = 10;
        _this.stack_count = 0;
        _this.explode_chance = 40;
        _this.cd = false;
        _this.power = 0;
        return _this;
    }
    WallOfBones.prototype.equip = function (character) {
        character.onKillTriggers.push(this);
    };
    WallOfBones.prototype.canBeForged = function (character) {
        return this.power < 3;
    };
    WallOfBones.prototype.forge = function (character) {
        this.power++;
    };
    WallOfBones.prototype.trigger = function (character) {
        var _this = this;
        if (this.cd)
            return;
        if (this.effect) {
            if (this.effect.isMax()) {
                this.effect.clear();
                // ------
                this.effect = undefined;
                // ------
                var explosion_effect = new BoneArmourExplosion_1.default(character.level);
                explosion_effect.setPoint(character.x, character.y);
                character.level.effects.push(explosion_effect);
                // ------
                var targets = character.level.enemies.concat(character.level.players.filter(function (elem) { return elem != character; }));
                var box = character.getBoxElipse();
                box.r = 20;
                for (var i = 0; i < targets.length; i++) {
                    var target = targets[i];
                    if (Func_1.default.elipseCollision(box, target.getBoxElipse())) {
                        target.takeDamage(character);
                    }
                }
                this.cd = true;
                setTimeout(function () {
                    _this.cd = false;
                }, 10000);
            }
            else {
                this.effect.update();
            }
        }
        else {
            var effect = new BoneArmour_1.default(character.level);
            effect.setOwner(character);
            effect.update(this.power * 2000);
            effect.producer = this;
            this.effect = effect;
            character.level.bindedEffects.push(effect);
        }
    };
    return WallOfBones;
}(Item_1.default));
exports.default = WallOfBones;
