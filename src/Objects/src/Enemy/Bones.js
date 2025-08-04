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
var Func_1 = require("../../../Func");
var Poison_1 = require("../../../Status/Poison");
var Armour_1 = require("../../Effects/Armour");
var Enemy_1 = require("./Enemy");
var Skull_1 = require("./Skull");
var Bones = /** @class */ (function (_super) {
    __extends(Bones, _super);
    function Bones(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'bones';
        _this.box_r = 2.2;
        _this.move_speed = 0.15;
        _this.attack_radius = 6;
        _this.attack_speed = 1600;
        _this.life_status = 2;
        _this.spawn_time = 1600;
        _this.ressurect_chance = 40;
        _this.getState();
        return _this;
    }
    Bones.prototype.takeDamage = function (unit, options) {
        if (unit === void 0) { unit = undefined; }
        if (options === void 0) { options = {}; }
        if (this.is_dead)
            return;
        if (options === null || options === void 0 ? void 0 : options.instant_death) {
            unit === null || unit === void 0 ? void 0 : unit.succesefulKill();
            this.is_dead = true;
            this.setDyingAct();
            return;
        }
        if (this.checkArmour(unit)) {
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y
            });
            var e = new Armour_1.default(this.level);
            e.setPoint(Func_1.default.random(this.x - 2, this.x + 2), this.y);
            e.z = Func_1.default.random(2, 8);
            this.level.effects.push(e);
            return;
        }
        if (options === null || options === void 0 ? void 0 : options.damage_value) {
            this.life_status -= options.damage_value;
        }
        else {
            this.life_status--;
        }
        if ((unit === null || unit === void 0 ? void 0 : unit.critical) && Func_1.default.chance(unit.critical)) {
            this.life_status--;
        }
        if (this.life_status <= 0) {
            if (unit === null || unit === void 0 ? void 0 : unit.blessed) {
                this.ressurect_chance = Math.round(this.ressurect_chance / 2);
            }
            if (options === null || options === void 0 ? void 0 : options.explode) {
                this.dead_type = 'explode';
                this.is_corpse = true;
                this.level.addSoundObject(this.getExplodedSound());
            }
            else if (options === null || options === void 0 ? void 0 : options.burn) {
                this.dead_type = 'burn_dying';
                this.is_corpse = true;
            }
            this.is_dead = true;
            this.create_grace_chance += (unit === null || unit === void 0 ? void 0 : unit.additional_chance_grace_create) ? unit === null || unit === void 0 ? void 0 : unit.additional_chance_grace_create : 0;
            unit === null || unit === void 0 ? void 0 : unit.succesefulKill();
            this.setDyingAct();
        }
        else {
            unit === null || unit === void 0 ? void 0 : unit.succesefulHit();
        }
    };
    Bones.prototype.setDeadState = function () {
        var _this = this;
        if (!this.freezed && this.state != 'burn_dying' && !Func_1.default.chance(this.ressurect_chance)) {
            this.is_corpse = true;
            this.state = 'dead';
            this.stateAct = this.deadAct;
            var skull = new Skull_1.default(this.level);
            skull.setPoint(this.x, this.y);
            this.level.enemies.push(skull);
        }
        else {
            this.state = 'dead_with_skull';
            this.stateAct = this.deadAct;
            setTimeout(function () {
                _this.setState(_this.setResurectAct);
            }, 3000);
        }
    };
    Bones.prototype.getWeaponHitedSound = function () {
        return {
            name: 'hit bones',
            x: this.x,
            y: this.y
        };
    };
    Bones.prototype.ressurectAct = function () {
    };
    Bones.prototype.setResurectAct = function () {
        var _this = this;
        this.state = 'ressurect';
        this.stateAct = this.ressurectAct;
        setTimeout(function () {
            _this.is_dead = false;
            _this.getState();
        }, 1500);
    };
    Bones.prototype.moveAct = function () {
        this.state = 'move';
        var a = Func_1.default.angle(this.x, this.y, this.target.x, this.target.y);
        this.moveByAngle(a);
    };
    Bones.prototype.getExplodedSound = function () {
        return {
            name: 'bones explode',
            x: this.x,
            y: this.y
        };
    };
    Bones.prototype.attackAct = function () {
        var _a, _b, _c;
        if (this.action && !this.hit) {
            this.hit = true;
            this.level.sounds.push({
                x: this.x,
                y: this.y,
                name: 'short sword swing'
            });
            var e = this.getBoxElipse();
            e.r = this.attack_radius;
            if (((_a = this.target) === null || _a === void 0 ? void 0 : _a.z) < 5 && Func_1.default.elipseCollision(e, (_b = this.target) === null || _b === void 0 ? void 0 : _b.getBoxElipse())) {
                (_c = this.target) === null || _c === void 0 ? void 0 : _c.takeDamage();
                if (Func_1.default.chance(50)) {
                    var status_1 = new Poison_1.default(Date.now(), 10000);
                    this.level.setStatus(this.target, status_1);
                }
            }
        }
    };
    Bones.prototype.setAttackState = function () {
        var _this = this;
        this.state = 'attack';
        this.is_attacking = true;
        this.stateAct = this.attackAct;
        this.action_time = this.attack_speed;
        this.cancelAct = function () {
            _this.action = false;
            _this.hit = false;
            _this.is_attacking = false;
        };
        this.setTimerToGetState(this.attack_speed);
    };
    Bones.prototype.idleAct = function () {
        var _this = this;
        if (this.can_check_player) {
            if (!this.target) {
                this.can_check_player = false;
                var p = this.level.players.filter(function (elem) { return Func_1.default.distance(_this, elem) <= _this.player_check_radius && !elem.is_dead && elem.z < 5; });
                p.sort(function (a, b) {
                    return Func_1.default.distance(a, _this) - Func_1.default.distance(b, _this);
                });
                this.target = p[0];
            }
            else {
                if (Func_1.default.distance(this, this.target) > this.player_check_radius || this.target.is_dead) {
                    this.target = undefined;
                }
            }
            setTimeout(function () {
                _this.can_check_player = true;
            }, 2000);
        }
        if (!this.target) {
            return;
        }
        var a_e = this.getBoxElipse();
        a_e.r = this.attack_radius;
        if (Func_1.default.elipseCollision(a_e, this.target.getBoxElipse())) {
            this.setState(this.setAttackState);
        }
        else {
            this.moveAct();
        }
    };
    return Bones;
}(Enemy_1.Enemy));
exports.default = Bones;
