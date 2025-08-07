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
var WeaponFragment_1 = require("../../Objects/Projectiles/WeaponFragment");
var SwordmanAbility_1 = require("./SwordmanAbility");
var ShatteredWeapon = /** @class */ (function (_super) {
    __extends(ShatteredWeapon, _super);
    function ShatteredWeapon(owner) {
        var _this = _super.call(this, owner) || this;
        _this.used = false;
        _this.name = 'shattered weapon';
        _this.cost = 4;
        return _this;
    }
    ShatteredWeapon.prototype.canUse = function () {
        return !this.used && this.owner.resource >= this.cost;
    };
    ShatteredWeapon.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.owner.is_attacking = true;
        this.used = true;
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
    ShatteredWeapon.prototype.act = function () {
        if (this.action && !this.hit) {
            var second = this.getSecondResource();
            this.hit = true;
            var a = undefined;
            var target = this.getTarget();
            if (target) {
                a = Func_1.default.angle(this.x, this.y, target.x, target.y);
            }
            a = a ? a : this.attack_angle;
            var count = 3 + Math.round(second / 3);
            var zone_per_tooth = 0.6;
            a -= (Math.round(count / 2) * zone_per_tooth);
            for (var i = 1; i <= count; i++) {
                var min_a = a + ((i - 1) * zone_per_tooth);
                var max_a = a + (i * zone_per_tooth);
                var angle = Math.random() * (max_a - min_a) + min_a;
                var proj = new WeaponFragment_1.WeaponFragment(this.level);
                proj.setAngle(angle);
                proj.setPoint(this.x, this.y);
                proj.setOwner(this);
                this.level.projectiles.push(proj);
            }
        }
    };
    return ShatteredWeapon;
}(SwordmanAbility_1.default));
exports.default = ShatteredWeapon;
