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
var RedPotion = /** @class */ (function (_super) {
    __extends(RedPotion, _super);
    function RedPotion() {
        var _this = _super.call(this) || this;
        _this.used = false;
        return _this;
    }
    RedPotion.prototype.canBeForged = function (character) {
        return this.used;
    };
    RedPotion.prototype.forge = function (character) {
        this.used = false;
    };
    RedPotion.prototype.equip = function (character) {
        character.reachNearDeadTriggers.push(this);
    };
    RedPotion.prototype.trigger = function (character) {
        if (this.used)
            return;
        character.addLife(3);
        this.used = true;
    };
    return RedPotion;
}(Item_1.default));
exports.default = RedPotion;
