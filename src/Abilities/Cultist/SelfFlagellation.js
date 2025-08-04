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
var Func_1 = require("../../Func");
var Blood_1 = require("../../Objects/Effects/Blood");
var CultistAbility_1 = require("./CultistAbility");
var SelfFlagellation = /** @class */ (function (_super) {
    __extends(SelfFlagellation, _super);
    function SelfFlagellation(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cd = false;
        _this.pack = false;
        _this.lesson = false;
        _this.name = 'self-flagellation';
        return _this;
    }
    SelfFlagellation.prototype.canUse = function () {
        return !this.cd;
    };
    SelfFlagellation.prototype.use = function () {
        var _this = this;
        if (this.cd)
            return;
        this.cd = true;
        setTimeout(function () {
            _this.cd = false;
        }, 6000 + this.owner.getSecondResource() * 300);
        this.owner.level.sounds.push({
            name: 'injured human',
            x: this.owner.x,
            y: this.owner.y
        });
        var e = new Blood_1.default(this.owner.level);
        e.setPoint(Func_1.default.random(this.owner.x - 2, this.owner.x + 2), this.owner.y);
        e.z = Func_1.default.random(2, 8);
        this.owner.level.effects.push(e);
        if (this.pack) {
            this.owner.can_be_lethaled = false;
        }
        this.owner.avoid_damaged_state_chance += 100;
        this.owner.takeDamage();
        this.owner.avoid_damaged_state_chance -= 100;
        if (this.pack) {
            this.owner.can_be_lethaled = true;
        }
        if (this.lesson) {
            this.owner.move_speed += 0.2;
            setTimeout(function () {
                _this.owner.move_speed -= 0.2;
            }, 1500);
        }
    };
    return SelfFlagellation;
}(CultistAbility_1.default));
exports.default = SelfFlagellation;
