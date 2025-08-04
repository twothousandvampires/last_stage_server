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
exports.Enemy = void 0;
var Func_1 = require("../../../Func");
var Armour_1 = require("../../Effects/Armour");
var Unit_1 = require("../Unit");
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(level) {
        var _this = _super.call(this, level) || this;
        _this.player_check_radius = 40;
        _this.is_spawning = true;
        _this.name = 'enemy';
        _this.can_check_player = true;
        _this.is_corpse = false;
        _this.dying_time = 1200;
        _this.spawn_time = 1200;
        _this.create_grace_chance = 15;
        _this.create_energy_chance = 5;
        _this.create_entity_chance = 5;
        _this.create_intervention_chance = 2;
        _this.create_chance = 15;
        return _this;
    }
    Enemy.prototype.getTotalWeights = function () {
        return [
            ['grace', this.create_grace_chance],
            ['energy', this.create_energy_chance],
            ['entity', this.create_entity_chance],
            ['intervention', this.create_intervention_chance]
        ];
    };
    Enemy.prototype.act = function (time) {
        if (!this.can_act || !this.stateAct)
            return;
        this.stateAct(time);
    };
    Enemy.prototype.spawnAct = function () {
    };
    Enemy.prototype.deadAct = function () {
    };
    Enemy.prototype.stunnedAct = function () {
    };
    Enemy.prototype.setStunAct = function () {
        var _this = this;
        this.stunned = true;
        this.state = 'stunned';
        this.stateAct = this.stunnedAct;
        this.cancelAct = function () {
            _this.stunned = false;
        };
    };
    Enemy.prototype.setStun = function (duration) {
        this.setState(this.setStunAct);
        this.setTimerToGetState(duration);
    };
    Enemy.prototype.setDyingAct = function () {
        if (this.freezed) {
            this.state = 'freeze_dying';
            this.is_corpse = true;
            this.level.sounds.push({
                name: 'shatter',
                x: this.x,
                y: this.y
            });
        }
        else {
            this.state = this.dead_type ? this.dead_type : 'dying';
        }
        this.stateAct = this.DyingAct;
        this.setTimerToGetState(this.dying_time);
    };
    Enemy.prototype.setIdleAct = function () {
        this.state = 'idle';
        this.stateAct = this.idleAct;
    };
    Enemy.prototype.setDeadState = function () {
        this.is_corpse = true;
        this.state = 'dead';
        this.stateAct = this.deadAct;
    };
    Enemy.prototype.DyingAct = function () {
    };
    Enemy.prototype.getExplodedSound = function () {
        return {
            name: 'corpse explode',
            x: this.x,
            y: this.y
        };
    };
    Enemy.prototype.takeDamage = function (unit, options) {
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
    Enemy.prototype.getWeaponHitedSound = function () {
        return {
            name: 'sword hit',
            x: this.x,
            y: this.y
        };
    };
    Enemy.prototype.getState = function () {
        if (this.is_dead) {
            this.setState(this.setDeadState);
        }
        else if (this.is_spawning) {
            this.action_time = this.spawn_time;
            this.setState(this.setSpawsState);
        }
        else {
            this.setState(this.setIdleAct);
        }
    };
    Enemy.prototype.setSpawsState = function () {
        var _this = this;
        this.state = 'spawn';
        this.stateAct = this.spawnAct;
        this.cancelAct = function () {
            _this.is_spawning = false;
        };
        this.setTimerToGetState(this.spawn_time);
    };
    Enemy.prototype.setAttackState = function () {
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
    return Enemy;
}(Unit_1.default));
exports.Enemy = Enemy;
