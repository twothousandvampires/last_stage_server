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
var BloodSphere_1 = require("../../Objects/Effects/BloodSphere");
var ThrowedWeapon_1 = require("../../Objects/Projectiles/ThrowedWeapon");
var SwordmanAbility_1 = require("./SwordmanAbility");
var WeaponThrow_1 = require("./WeaponThrow");
var Whirlwind = /** @class */ (function (_super) {
    __extends(Whirlwind, _super);
    function Whirlwind(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cost = 7;
        _this.blood_harvest = false;
        _this.fan_of_swords = false;
        _this.name = 'whirlwind';
        return _this;
    }
    Whirlwind.prototype.canUse = function () {
        return this.owner.resource >= this.cost;
    };
    Whirlwind.prototype.afterUse = function () {
        var _this = this;
        this.owner.useNotUtilityTriggers.forEach(function (elem) {
            elem.trigger(_this.owner);
        });
        this.owner.resource -= this.cost;
        this.owner.second_ab.used = false;
        this.owner.last_skill_used_time = this.owner.time;
    };
    Whirlwind.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.owner.is_attacking = true;
        this.owner.state = 'swing';
        this.owner.can_move_by_player = false;
        this.owner.stateAct = this.act;
        this.owner.cancelAct = function () {
            _this.owner.is_attacking = false;
            _this.owner.action = false;
            _this.owner.can_move_by_player = true;
            _this.owner.hit = false;
        };
        this.owner.setTimerToGetState(this.owner.attack_speed / 2);
    };
    Whirlwind.prototype.act = function () {
        var _this = this;
        if (this.action && !this.hit) {
            this.hit = true;
            var second = this.getSecondResource();
            var to_damage_count_1 = this.getTargetsCount() * 2;
            var enemies = this.level.enemies;
            var players = this.level.players;
            var targets = enemies.concat(players);
            var e_1 = this.getBoxElipse();
            e_1.r += 5 + Math.ceil(second / 2);
            var was_hit_1 = false;
            var kill_count_1 = 0;
            targets.forEach(function (elem) {
                if (to_damage_count_1 > 0 && elem != _this && Func_1.default.elipseCollision(e_1, elem.getBoxElipse())) {
                    was_hit_1 = true;
                    elem.takeDamage(_this);
                    to_damage_count_1--;
                    _this.level.sounds.push(elem.getWeaponHitedSound());
                    if (elem.is_dead) {
                        kill_count_1++;
                        for (var i = 0; i < 2; i++) {
                            var e_2 = new Blood_1.default(_this.level);
                            e_2.setPoint(elem.x, elem);
                            _this.level.effects.push(e_2);
                        }
                    }
                }
            });
            if (this.third_ab.blood_harvest && kill_count_1 > 0) {
                var chance = 20 * kill_count_1;
                if (Func_1.default.chance(chance)) {
                    var sphere = new BloodSphere_1.default(this.level, kill_count_1);
                    sphere.setPoint(this.x, this.y);
                    this.level.bindedEffects.push(sphere);
                }
            }
            if (!was_hit_1) {
                this.level.sounds.push({
                    name: 'sword swing',
                    x: this.x,
                    y: this.y
                });
            }
            if (this.third_ab.fan_of_swords) {
                var count = to_damage_count_1 / 2;
                var zones = 6.28 / count;
                for (var i = 1; i <= count; i++) {
                    var min_a = (i - 1) * zones;
                    var max_a = i * zones;
                    var angle = Math.random() * (max_a - min_a) + min_a;
                    var proj = new ThrowedWeapon_1.ThrowedWeapon(this.level);
                    if (this.first_ab instanceof WeaponThrow_1.default) {
                        if (this.first_ab.shattering) {
                            proj.shattered = true;
                        }
                        else if (this.first_ab.returning) {
                            proj.returned = true;
                        }
                    }
                    proj.point_added = true;
                    proj.setAngle(angle);
                    proj.setPoint(this.x, this.y);
                    proj.setOwner(this);
                    this.level.projectiles.push(proj);
                }
            }
        }
    };
    return Whirlwind;
}(SwordmanAbility_1.default));
exports.default = Whirlwind;
