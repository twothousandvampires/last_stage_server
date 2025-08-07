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
var ThrowedWeapon_1 = require("../../Objects/Projectiles/ThrowedWeapon");
var SwordmanAbility_1 = require("./SwordmanAbility");
var WeaponThrow = /** @class */ (function (_super) {
    __extends(WeaponThrow, _super);
    function WeaponThrow(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cd = false;
        _this.light_grip = false;
        _this.returning = false;
        _this.shattering = false;
        _this.name = 'weapon throw';
        return _this;
    }
    WeaponThrow.prototype.canUse = function () {
        return !this.cd;
    };
    WeaponThrow.prototype.use = function () {
        var _this = this;
        if (this.cd)
            return;
        this.cd = true;
        var cd_time = 4000;
        if (this.light_grip && Func_1.default.chance(50)) {
            cd_time = Math.round(cd_time / 2);
        }
        setTimeout(function () {
            _this.cd = false;
        }, cd_time);
        var rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40);
        var rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40);
        if (rel_x < this.owner.x) {
            this.owner.flipped = true;
        }
        else {
            this.owner.flipped = false;
        }
        this.owner.attack_angle = Func_1.default.angle(this.owner.x, this.owner.y, rel_x, rel_y);
        this.owner.is_attacking = true;
        this.owner.state = 'attack';
        var attack_move_speed_penalty = this.owner.getAttackMoveSpeedPenalty();
        this.owner.addMoveSpeedPenalty(-attack_move_speed_penalty);
        this.owner.stateAct = this.act;
        var attack_speed = this.owner.getAttackSpeed();
        this.owner.action_time = attack_speed;
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.addMoveSpeedPenalty(attack_move_speed_penalty);
            setTimeout(function () {
                _this.owner.hit = false;
                _this.owner.is_attacking = false;
            }, 50);
        };
        this.owner.setTimerToGetState(attack_speed);
    };
    WeaponThrow.prototype.act = function () {
        if (this.action && !this.hit) {
            this.level.sounds.push({
                name: 'sword swing',
                x: this.x,
                y: this.y
            });
            this.hit = true;
            var proj = new ThrowedWeapon_1.ThrowedWeapon(this.level);
            var second = this.getSecondResource();
            var is_returning = !this.first_ab.shattering && this.first_ab.returning && Func_1.default.chance(40 + second * 5);
            if (is_returning) {
                proj.returned = true;
            }
            else {
                var is_shatter = this.first_ab.shattering && !this.first_ab.returning && Func_1.default.chance(40 + second * 5);
                if (is_shatter) {
                    proj.shattered = true;
                }
            }
            proj.setAngle(this.attack_angle);
            proj.setOwner(this);
            proj.setPoint(this.x, this.y);
            this.level.projectiles.push(proj);
        }
    };
    return WeaponThrow;
}(SwordmanAbility_1.default));
exports.default = WeaponThrow;
