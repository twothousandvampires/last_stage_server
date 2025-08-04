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
var Armour_1 = require("../../Effects/Armour");
var SpecterVortex_1 = require("../../Effects/SpecterVortex");
var SpecterSoulSeeker_1 = require("../../Projectiles/SpecterSoulSeeker");
var Enemy_1 = require("./Enemy");
var Skull_1 = require("./Skull");
var Specter = /** @class */ (function (_super) {
    __extends(Specter, _super);
    function Specter(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'specter';
        _this.box_r = 2.5;
        _this.move_speed = 0.05;
        _this.attack_radius = 7;
        _this.attack_speed = 2000;
        _this.life_status = 2;
        _this.spawn_time = 1600;
        _this.ressurect_chance = 30;
        _this.armour_rate = 70;
        _this.want_to_cast = true;
        _this.can_cast_vortex = true;
        _this.can_cast_seekers = true;
        _this.create_grace_chance = 90;
        _this.create_chance = 90;
        _this.getState();
        return _this;
    }
    Specter.prototype.takeDamage = function (unit, options) {
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
    Specter.prototype.setDeadState = function () {
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
            this.phasing = true;
            this.state = 'dead_with_skull';
            this.stateAct = this.deadAct;
            setTimeout(function () {
                _this.setState(_this.setResurectAct);
            }, 3000);
        }
    };
    Specter.prototype.getWeaponHitedSound = function () {
        return {
            name: 'hit bones',
            x: this.x,
            y: this.y
        };
    };
    Specter.prototype.ressurectAct = function () {
    };
    Specter.prototype.setResurectAct = function () {
        var _this = this;
        this.state = 'ressurect';
        this.stateAct = this.ressurectAct;
        this.phasing = false;
        setTimeout(function () {
            _this.is_dead = false;
            _this.getState();
        }, 1500);
    };
    Specter.prototype.moveAct = function () {
        this.state = 'move';
        var a = Func_1.default.angle(this.x, this.y, this.target.x, this.target.y);
        this.moveByAngle(a);
    };
    Specter.prototype.getExplodedSound = function () {
        return {
            name: 'bones explode',
            x: this.x,
            y: this.y
        };
    };
    Specter.prototype.attackAct = function () {
        var _a, _b, _c;
        if (this.action && !this.hit) {
            this.hit = true;
            this.level.sounds.push({
                x: this.x,
                y: this.y,
                name: 'specter attack'
            });
            var e = this.getBoxElipse();
            e.r = this.attack_radius;
            if (((_a = this.target) === null || _a === void 0 ? void 0 : _a.z) < 5 && Func_1.default.checkAngle(this, this.target, this.attack_angle, 2.4) && Func_1.default.elipseCollision(e, (_b = this.target) === null || _b === void 0 ? void 0 : _b.getBoxElipse())) {
                (_c = this.target) === null || _c === void 0 ? void 0 : _c.takeDamage();
            }
        }
    };
    Specter.prototype.setAttackState = function () {
        var _this = this;
        var _a, _b;
        this.state = 'attack';
        this.is_attacking = true;
        this.stateAct = this.attackAct;
        this.action_time = this.attack_speed;
        this.attack_angle = Func_1.default.angle(this.x, this.y, (_a = this.target) === null || _a === void 0 ? void 0 : _a.x, (_b = this.target) === null || _b === void 0 ? void 0 : _b.y);
        this.cancelAct = function () {
            _this.action = false;
            _this.hit = false;
            _this.is_attacking = false;
        };
        this.setTimerToGetState(this.attack_speed);
    };
    Specter.prototype.idleAct = function () {
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
            var d = Func_1.default.distance(this, this.target);
            if (this.can_cast_vortex && d <= 12 && d > 5) {
                this.spell_name = 'vortex';
                this.can_cast_vortex = false;
                setTimeout(function () {
                    _this.can_cast_vortex = true;
                }, 20000);
            }
            else if (this.can_cast_seekers && d <= 30 && d > 5) {
                this.spell_name = 'soul seekers';
                this.can_cast_seekers = false;
                setTimeout(function () {
                    _this.can_cast_seekers = true;
                }, 25000);
            }
            setTimeout(function () {
                _this.want_to_cast = true;
            }, Func_1.default.random(6000, 12000));
        }
        if (this.spell_name) {
            this.setState(this.setCastState);
        }
        else {
            var a_e = this.getBoxElipse();
            a_e.r = this.attack_radius;
            if (Func_1.default.elipseCollision(a_e, this.target.getBoxElipse())) {
                this.setState(this.setAttackState);
            }
            else {
                this.moveAct();
            }
        }
    };
    Specter.prototype.setCastState = function () {
        var _this = this;
        this.state = 'cast';
        this.is_attacking = true;
        this.stateAct = this.castAct;
        this.action_time = 2000;
        this.cancelAct = function () {
            _this.action = false;
            _this.is_attacking = false;
        };
        this.setTimerToGetState(2000);
    };
    Specter.prototype.castAct = function () {
        if (this.action && !this.hit) {
            this.hit = true;
            if (!this.target)
                return;
            this.level.sounds.push({
                name: 'dark cast',
                x: this.x,
                y: this.y
            });
            if (this.spell_name === 'vortex') {
                var vortex = new SpecterVortex_1.default(this.level);
                vortex.setOwner(this);
                vortex.setPoint(this.x, this.y);
                this.level.bindedEffects.push(vortex);
            }
            else if (this.spell_name === 'soul seekers') {
                var c = 8;
                var zones = 6.28 / c;
                for (var i = 1; i <= c; i++) {
                    var min_a = (i - 1) * zones;
                    var max_a = i * zones;
                    var angle = Math.random() * (max_a - min_a) + min_a;
                    var proj = new SpecterSoulSeeker_1.SpecterSoulSeeker(this.level);
                    proj.setAngle(angle);
                    proj.setPoint(this.x, this.y);
                    proj.setOwner(this);
                    this.level.projectiles.push(proj);
                }
            }
        }
    };
    return Specter;
}(Enemy_1.Enemy));
exports.default = Specter;
