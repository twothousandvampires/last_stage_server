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
var Effects_js_1 = require("./Effects.js");
var BoneArmour = /** @class */ (function (_super) {
    __extends(BoneArmour, _super);
    function BoneArmour(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'bone armour';
        _this.x = undefined;
        _this.y = undefined;
        _this.value = 0;
        _this.max_value = 10;
        _this.start = Date.now();
        _this.duration = 5000;
        return _this;
    }
    BoneArmour.prototype.act = function () {
        if (Date.now() - this.start > this.duration) {
            this.clear();
            return;
        }
        if (!this.owner) {
            return;
        }
        this.x = this.owner.x;
        this.y = this.owner.y;
    };
    BoneArmour.prototype.setOwner = function (character) {
        this.owner = character;
    };
    BoneArmour.prototype.apply = function () {
        this.owner.armour_rate += this.value;
    };
    BoneArmour.prototype.clear = function () {
        var _this = this;
        this.owner.armour_rate -= this.value;
        this.value = 0;
        this.level.deleted.push(this.id);
        this.producer.effect = undefined;
        this.level.bindedEffects = this.level.bindedEffects.filter(function (e) { return e != _this; });
    };
    BoneArmour.prototype.update = function (adds_duration) {
        if (adds_duration === void 0) { adds_duration = 0; }
        this.start = Date.now();
        this.duration += adds_duration;
        this.value += 1;
        this.owner.armour_rate += 1;
        this.owner.newStatus({
            name: 'wall of bones',
            duration: this.duration,
            desc: 'armour is increased(' + this.value + ')'
        });
    };
    BoneArmour.prototype.isMax = function () {
        return this.value >= this.max_value;
    };
    return BoneArmour;
}(Effects_js_1.default));
exports.default = BoneArmour;
