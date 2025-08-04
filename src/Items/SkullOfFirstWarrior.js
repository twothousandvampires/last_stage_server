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
var SkullOfFirstWarrior = /** @class */ (function (_super) {
    __extends(SkullOfFirstWarrior, _super);
    function SkullOfFirstWarrior() {
        var _this = _super.call(this) || this;
        _this.kill_count = 0;
        _this.countable = true;
        _this.threshold = 8;
        _this.add_might = 8;
        _this.power = 0;
        return _this;
    }
    SkullOfFirstWarrior.prototype.canBeForged = function (character) {
        return this.power < 3;
    };
    SkullOfFirstWarrior.prototype.forge = function (character) {
        this.power++;
        this.threshold -= 1;
        this.add_might += 1;
    };
    SkullOfFirstWarrior.prototype.equip = function (character) {
        character.onHitTriggers.push(this);
    };
    SkullOfFirstWarrior.prototype.trigger = function (character) {
        var _this = this;
        if (!this.countable)
            return;
        this.kill_count++;
        if (this.kill_count >= this.threshold) {
            character.might += this.add_might;
            this.kill_count = 0;
            this.countable = false;
            character.newStatus({
                name: 'skull of first warrior',
                duration: 6000,
                desc: 'might increased'
            });
            setTimeout(function () {
                character.might -= _this.add_might;
                _this.countable = true;
            }, 6000);
        }
    };
    return SkullOfFirstWarrior;
}(Item_1.default));
exports.default = SkullOfFirstWarrior;
