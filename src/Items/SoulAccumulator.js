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
var Item_1 = require("./Item");
var SoulAccumulator = /** @class */ (function (_super) {
    __extends(SoulAccumulator, _super);
    function SoulAccumulator() {
        var _this = _super.call(this) || this;
        _this.value = 5;
        _this.power = 0;
        return _this;
    }
    SoulAccumulator.prototype.canBeForged = function (character) {
        return this.power < 3;
    };
    SoulAccumulator.prototype.forge = function (character) {
        this.power++;
        this.value += 1;
    };
    SoulAccumulator.prototype.equip = function (character) {
        character.playerDeadTriggers.push(this);
    };
    SoulAccumulator.prototype.trigger = function (character) {
        if (!character.life_status)
            return;
        character.might += this.value;
        character.agility += this.value;
        character.knowledge += this.value;
        character.speed += this.value;
        character.will += this.value;
        character.durability += this.value;
    };
    return SoulAccumulator;
}(Item_1.default));
exports.default = SoulAccumulator;
