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
var Item_1 = require("./Item");
var DoomMantia = /** @class */ (function (_super) {
    __extends(DoomMantia, _super);
    function DoomMantia() {
        var _this = _super.call(this) || this;
        _this.chance = 30;
        _this.distance = 20;
        _this.power = 0;
        return _this;
    }
    DoomMantia.prototype.canBeForged = function (character) {
        return this.power < 3;
    };
    DoomMantia.prototype.forge = function (character) {
        this.power++;
        this.chance += 5;
    };
    DoomMantia.prototype.equip = function (character) {
        character.playerTakeLethalDamageTriggers.push(this);
    };
    DoomMantia.prototype.trigger = function (character) {
        var _this = this;
        if (Func_1.default.chance(this.chance)) {
            var targets = character.level.enemies.concat(character.level.players.filter(function (elem) { return elem != character; }));
            targets = targets.filter(function (elem) { return Func_1.default.distance(elem, character) <= _this.distance; });
            var target = targets[Math.floor(Math.random() * targets.length)];
            if (target) {
                target.takeDamage(character, {
                    instant_death: true
                });
                character.can_be_lethaled = false;
            }
        }
    };
    return DoomMantia;
}(Item_1.default));
exports.default = DoomMantia;
