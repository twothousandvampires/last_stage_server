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
var CurseOfDamned_1 = require("../../../Status/CurseOfDamned");
var GhostGrip_1 = require("../../../Status/GhostGrip");
var Armour_1 = require("../../Effects/Armour");
var GhostGripArea_1 = require("../../Effects/GhostGripArea");
var SharpedBone_1 = require("../../Projectiles/SharpedBone");
var Bones_1 = require("./Bones");
var Enemy_1 = require("./Enemy");
var Skull_1 = require("./Skull");
var FlyingBones = /** @class */ (function (_super) {
    __extends(FlyingBones, _super);
    function FlyingBones(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'flying bones';
        _this.box_r = 2.2;
        _this.move_speed = 0.1;
        _this.attack_radius = 6;
        _this.attack_speed = 1600;
        _this.life_status = 2;
        _this.spawn_time = 1600;
        _this.can_cast_grip = true;
        _this.can_cast_bones = true;
        _this.can_cast_curse = true;
        _this.create_grace_chance = 40;
        _this.create_chance = 80;
        _this.ressurect_chance = 30;
        _this.want_to_cast = true;
        _this.getState();
        return _this;
    }
    FlyingBones.prototype.takeDamage = function (unit, options) {
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
    FlyingBones.prototype.setDeadState = function () {
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
    FlyingBones.prototype.getWeaponHitedSound = function () {
        return {
            name: 'hit bones',
            x: this.x,
            y: this.y
        };
    };
    FlyingBones.prototype.ressurectAct = function () {
    };
    FlyingBones.prototype.setResurectAct = function () {
        var _this = this;
        this.state = 'ressurect';
        this.stateAct = this.ressurectAct;
        setTimeout(function () {
            _this.is_dead = false;
            _this.getState();
        }, 1500);
    };
    FlyingBones.prototype.moveAct = function () {
        this.state = 'move';
        var a = Func_1.default.angle(this.x, this.y, this.target.x, this.target.y);
        this.moveByAngle(a);
    };
    FlyingBones.prototype.getExplodedSound = function () {
        return {
            name: 'bones explode',
            x: this.x,
            y: this.y
        };
    };
    FlyingBones.prototype.attackAct = function () {
        var _this = this;
        var _a, _b;
        if (this.action && !this.hit) {
            this.hit = true;
            if (!this.target)
                return;
            this.level.sounds.push({
                name: 'dark cast',
                x: this.x,
                y: this.y
            });
            if (this.spell_name === 'bones') {
                var bone_count = this.level.enemies.filter(function (elem) { return elem instanceof Bones_1.default && Func_1.default.distance(_this, elem) <= 20; }).length;
                bone_count++;
                if (bone_count > 12) {
                    bone_count = 12;
                }
                var angle = Func_1.default.angle(this.x, this.y, (_a = this.target) === null || _a === void 0 ? void 0 : _a.x, (_b = this.target) === null || _b === void 0 ? void 0 : _b.y);
                for (var i = 0; i < bone_count; i++) {
                    var proj = new SharpedBone_1.SharpedBone(this.level);
                    proj.setPoint(this.x, this.y);
                    var a = angle + i * 0.15;
                    proj.setAngle(a);
                    this.level.projectiles.push(proj);
                }
            }
            else if (this.spell_name === 'ghost grip') {
                var ppl = this.level.players.filter(function (elem) { return Func_1.default.distance(elem, _this) <= 30; });
                var e = new GhostGripArea_1.default(this.level);
                e.setPoint(this.x, this.y);
                this.level.effects.push(e);
                ppl.forEach(function (elem) {
                    var status = new GhostGrip_1.default(elem.time, 4000);
                    _this.level.setStatus(elem, status);
                });
            }
            else if (this.spell_name === 'curse') {
                var status_1 = new CurseOfDamned_1.default(this.target.time, 4000);
                this.level.setStatus(this.target, status_1);
            }
        }
    };
    FlyingBones.prototype.setAttackState = function () {
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
    FlyingBones.prototype.retreatAct = function () {
        var a = this.retreat_angle;
        if (!a)
            return;
        this.moveByAngle(a);
    };
    FlyingBones.prototype.setRetreatState = function () {
        var _this = this;
        var _a;
        this.state = 'move';
        this.retreat_angle = Func_1.default.angle((_a = this.target) === null || _a === void 0 ? void 0 : _a.x, this.target.y, this.x, this.y);
        this.stateAct = this.retreatAct;
        this.cancelAct = function () {
            _this.retreat_angle = undefined;
        };
        this.setTimerToGetState(2000);
    };
    FlyingBones.prototype.idleAct = function () {
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
        this.spell_name = undefined;
        if (this.want_to_cast) {
            this.want_to_cast = false;
            if (this.can_cast_grip && Func_1.default.distance(this, this.target) <= 10) {
                this.spell_name = 'ghost grip';
                this.can_cast_grip = false;
                setTimeout(function () {
                    _this.can_cast_grip = true;
                }, 10000);
            }
            else if (this.can_cast_bones && Func_1.default.distance(this, this.target) <= 30) {
                this.spell_name = 'bones';
                this.can_cast_bones = false;
                setTimeout(function () {
                    _this.can_cast_bones = true;
                }, 10000);
            }
            else if (this.can_cast_curse && Func_1.default.distance(this, this.target) <= 20) {
                this.spell_name = 'curse';
                this.can_cast_curse = false;
                setTimeout(function () {
                    _this.can_cast_curse = true;
                }, 12000);
            }
            setTimeout(function () {
                _this.want_to_cast = true;
            }, Func_1.default.random(3000, 6000));
        }
        //todo can cast
        if (this.spell_name) {
            this.setState(this.setAttackState);
        }
        else {
            this.setState(this.setRetreatState);
        }
    };
    return FlyingBones;
}(Enemy_1.Enemy));
exports.default = FlyingBones;
