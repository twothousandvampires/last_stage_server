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
var Quake_1 = require("../../Objects/Effects/Quake");
var RocksFromCeil_1 = require("../../Objects/Effects/RocksFromCeil");
var Weakness_1 = require("../../Status/Weakness");
var SwordmanAbility_1 = require("./SwordmanAbility");
var Quake = /** @class */ (function (_super) {
    __extends(Quake, _super);
    function Quake(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cost = 7;
        _this.direction = false;
        _this.impact = false;
        _this.consequences = false;
        _this.selfcare = false;
        _this.name = 'quake';
        return _this;
    }
    Quake.prototype.canUse = function () {
        return this.owner.resource >= this.cost;
    };
    Quake.prototype.afterUse = function () {
        var _this = this;
        this.owner.useNotUtilityTriggers.forEach(function (elem) {
            elem.trigger(_this.owner);
        });
        this.owner.resource -= this.cost;
        this.owner.second_ab.used = false;
        this.owner.last_skill_used_time = this.owner.time;
    };
    Quake.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.owner.is_attacking = true;
        this.owner.state = 'jump';
        this.owner.can_move_by_player = false;
        this.owner.stateAct = this.getAct();
        this.owner.avoid_damaged_state_chance += 100;
        this.owner.cancelAct = function () {
            _this.owner.z = 0;
            _this.owner.is_attacking = false;
            _this.direction = false;
            _this.impact = false;
            _this.owner.avoid_damaged_state_chance -= 100;
            _this.owner.can_move_by_player = true;
        };
    };
    Quake.prototype.getAct = function () {
        var ability = this;
        var owner = this.owner;
        var add_z = 0.7;
        return function () {
            if (ability.impact) {
                var second = owner.getSecondResource();
                var enemies = owner.level.enemies;
                var players = owner.level.players;
                if (ability.selfcare) {
                    players = players.filter(function (elem) { return elem != owner; });
                }
                var targets = enemies.concat(players);
                var hited_1 = [];
                var add = ability.consequences ? 4 : 0;
                add += second;
                var first_wave_1 = owner.getBoxElipse();
                first_wave_1.r = 5 + add;
                var second_wave_1 = owner.getBoxElipse();
                second_wave_1.r = 8 + add;
                var third_wave_1 = owner.getBoxElipse();
                third_wave_1.r = 11 + add;
                var to_damage_count_1 = owner.getTargetsCount() * 2;
                targets.forEach(function (elem) {
                    if (to_damage_count_1 > 0 && Func_1.default.elipseCollision(first_wave_1, elem.getBoxElipse())) {
                        hited_1.push(elem);
                        elem.takeDamage(owner, {
                            explode: true
                        });
                        to_damage_count_1--;
                    }
                });
                targets.forEach(function (elem) {
                    if (!hited_1.includes(elem) && Func_1.default.elipseCollision(second_wave_1, elem.getBoxElipse())) {
                        hited_1.push(elem);
                        elem.setStun(4000);
                    }
                });
                targets.forEach(function (elem) {
                    if (!hited_1.includes(elem) && Func_1.default.elipseCollision(third_wave_1, elem.getBoxElipse())) {
                        elem.addMoveSpeedPenalty(-60);
                        setTimeout(function () {
                            elem.addMoveSpeedPenalty(60);
                        }, 5000);
                    }
                });
                var effect = new Quake_1.default(owner.level);
                effect.setPoint(owner.x, owner.y);
                owner.level.effects.push(effect);
                owner.getState();
                var effect2 = new RocksFromCeil_1.default(this.level);
                effect2.setPoint(owner.x, owner.y);
                owner.level.effects.push(effect2);
                var status_1 = new Weakness_1.default(owner.time, ability.consequences ? 6000 : 3000);
                owner.level.setStatus(owner, status_1);
                return;
            }
            else {
                owner.z += ability.direction ? -add_z : add_z;
                if (ability.direction) {
                    add_z += 0.05;
                    if (add_z > 0.7) {
                        ability.impact = true;
                    }
                }
                else {
                    add_z -= 0.05;
                    if (add_z < 0) {
                        ability.direction = true;
                    }
                }
            }
        };
    };
    return Quake;
}(SwordmanAbility_1.default));
exports.default = Quake;
