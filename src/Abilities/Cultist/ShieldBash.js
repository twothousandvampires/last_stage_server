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
var Bone_1 = require("../../Objects/Projectiles/Bone");
var CultistAbility_1 = require("./CultistAbility");
var ShieldBash = /** @class */ (function (_super) {
    __extends(ShieldBash, _super);
    function ShieldBash(owner) {
        var _this = _super.call(this, owner) || this;
        _this.name = 'shield bash';
        _this.deafening_wave = false;
        _this.hate = false;
        _this.coordination = false;
        _this.cost = 4;
        return _this;
    }
    ShieldBash.prototype.canUse = function () {
        return this.owner.getSecondResource() >= this.cost && this.owner.can_attack;
    };
    ShieldBash.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        var rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40);
        var rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40);
        if (this.coordination) {
            this.owner.pay_to_cost = Math.round(this.cost / 2);
        }
        else {
            this.owner.pay_to_cost = this.cost;
        }
        this.owner.c_x = rel_x;
        this.owner.c_y = rel_y;
        if (rel_x < this.owner.x) {
            this.owner.flipped = true;
        }
        else {
            this.owner.flipped = false;
        }
        this.owner.attack_angle = Func_1.default.angle(this.owner.x, this.owner.y, rel_x, rel_y);
        this.owner.is_attacking = true;
        this.owner.state = 'shield hit';
        var move_speed_reduce = this.owner.getMoveSpeedReduceWhenUseSkill();
        this.owner.addMoveSpeedPenalty(-move_speed_reduce);
        this.owner.stateAct = this.act;
        var attack_speed = this.owner.getAttackSpeed();
        if (this.coordination) {
            attack_speed = attack_speed / 1.5;
        }
        this.owner.action_time = attack_speed;
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.addMoveSpeedPenalty(move_speed_reduce);
            setTimeout(function () {
                _this.owner.hit = false;
                _this.owner.is_attacking = false;
                _this.owner.hit_x = undefined;
                _this.owner.hit_y = undefined;
                _this.used = false;
            }, 50);
        };
        this.owner.setTimerToGetState(attack_speed);
    };
    ShieldBash.prototype.act = function () {
        var _this = this;
        if (this.action && !this.hit) {
            this.hit = true;
            var second_resource_1 = this.getSecondResource();
            this.payCost();
            var enemies = this.level.enemies;
            var players = this.level.players;
            var attack_elipse_1 = this.getBoxElipse();
            attack_elipse_1.r = 8;
            var f = enemies.filter(function (elem) { return Func_1.default.checkAngle(_this, elem, _this.attack_angle, _this.weapon_angle); });
            var p = players.filter(function (elem) { return Func_1.default.checkAngle(_this, elem, _this.attack_angle, _this.weapon_angle); });
            var filtered_to_damage = f.filter(function (elem) { return Func_1.default.elipseCollision(attack_elipse_1, elem.getBoxElipse()); });
            var filtered_to_damage_players = p.filter(function (elem) { return Func_1.default.elipseCollision(attack_elipse_1, elem.getBoxElipse()); });
            this.target = undefined;
            filtered_to_damage.concat(filtered_to_damage_players).forEach(function (elem) {
                if (_this.second_ab.hate && Func_1.default.chance(40)) {
                    elem.takeDamage(_this, {
                        explode: true
                    });
                    if (elem.is_dead) {
                        var count = Func_1.default.random(1, 1 + second_resource_1);
                        var zones = 6.28 / count;
                        for (var i = 1; i <= count; i++) {
                            var min_a = (i - 1) * zones;
                            var max_a = i * zones;
                            var angle = Math.random() * (max_a - min_a) + min_a;
                            var proj = new Bone_1.Bone(_this.level);
                            proj.setAngle(angle);
                            proj.setPoint(elem.x, elem.y);
                            _this.level.projectiles.push(proj);
                        }
                    }
                }
                else {
                    elem.takeDamage(_this);
                }
            });
            if (!this.second_ab.hate) {
                var stan_duration_1 = this.second_ab.deafening_wave ? 3000 : 2000;
                stan_duration_1 += second_resource_1 * 100;
                attack_elipse_1.r = 12;
                if (this.second_ab.deafening_wave) {
                    attack_elipse_1.r += 8;
                }
                var filtered_to_stun = f.filter(function (elem) { return Func_1.default.elipseCollision(attack_elipse_1, elem.getBoxElipse()); });
                filtered_to_stun.forEach(function (elem) {
                    if (!elem.is_dead) {
                        elem.setStun(stan_duration_1);
                    }
                });
            }
            this.level.sounds.push({
                name: 'ground hit',
                x: this.x,
                y: this.y
            });
        }
    };
    return ShieldBash;
}(CultistAbility_1.default));
exports.default = ShieldBash;
