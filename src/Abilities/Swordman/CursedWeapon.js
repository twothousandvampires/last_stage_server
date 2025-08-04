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
var CursedWeaponStatus_1 = require("../../Status/CursedWeaponStatus");
var SwordmanAbility_1 = require("./SwordmanAbility");
var CursedWeapon = /** @class */ (function (_super) {
    __extends(CursedWeapon, _super);
    function CursedWeapon(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cd = false;
        _this.cast = false;
        _this.drinker = false;
        _this.name = 'cursed weapon';
        return _this;
    }
    CursedWeapon.prototype.canUse = function () {
        return !this.cd;
    };
    CursedWeapon.prototype.use = function () {
        var _this = this;
        if (this.cd)
            return;
        this.cd = true;
        setTimeout(function () {
            _this.cd = false;
            _this.cast = false;
        }, 20000);
        this.owner.state = 'cast';
        this.owner.can_move_by_player = false;
        this.owner.stateAct = this.getAct();
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.can_move_by_player = true;
            _this.owner.action_time = undefined;
            _this.cast = false;
        };
        this.owner.action_time = 1500;
        setTimeout(function () {
            _this.cast = true;
        }, 1500);
    };
    CursedWeapon.prototype.getAct = function () {
        var ability = this;
        return function () {
            if (ability.cast) {
                var status_1 = new CursedWeaponStatus_1.default(this.time, 8000, ability.drinker);
                this.level.setStatus(this, status_1);
                this.level.sounds.push({
                    name: 'dark cast',
                    x: this.x,
                    y: this.y
                });
                ability.cast = false;
                this.getState();
            }
        };
    };
    return CursedWeapon;
}(SwordmanAbility_1.default));
exports.default = CursedWeapon;
