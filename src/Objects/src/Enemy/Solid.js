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
var GroundHit_1 = require("../../Effects/GroundHit");
var Enemy_1 = require("./Enemy");
var Solid = /** @class */ (function (_super) {
    __extends(Solid, _super);
    function Solid(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'solid';
        _this.box_r = 4;
        _this.move_speed = 0.15;
        _this.attack_radius = 7;
        _this.attack_speed = 1800;
        _this.explode = false;
        _this.spawn_time = 1200;
        _this.getState();
        _this.life_status = 4;
        _this.hit_x = 0;
        _this.hit_y = 0;
        _this.armour_rate = 10;
        _this.create_grace_chance = 50;
        _this.create_chance = 80;
        _this.create_chance = 80;
        return _this;
    }
    Solid.prototype.setDeadState = function () {
        this.state = 'dead';
        this.stateAct = this.deadAct;
    };
    Solid.prototype.deadAct = function () {
        var _this = this;
        if (!this.explode && this.action) {
            this.explode = true;
            this.action = false;
            this.state = 'dead_explode';
            var targets = this.level.enemies.concat(this.level.players);
            targets.forEach(function (e) {
                if (e != _this && Func_1.default.distance(_this, e) <= 12) {
                    e.takeDamage(undefined, {
                        burn: true
                    });
                }
            });
            setTimeout(function () {
                _this.is_corpse = true;
            }, 800);
        }
    };
    Solid.prototype.moveAct = function () {
        this.state = 'move';
        var a = Func_1.default.angle(this.x, this.y, this.target.x, this.target.y);
        this.moveByAngle(a);
    };
    Solid.prototype.attackAct = function () {
        if (this.action && !this.hit) {
            this.hit = true;
            var e_1 = this.getBoxElipse();
            e_1.x = this.hit_x;
            e_1.y = this.hit_y;
            e_1.r = 4;
            var effect = new GroundHit_1.default(this.level);
            effect.setPoint(e_1.x, e_1.y);
            this.level.effects.push(effect);
            this.level.addSound('ground hit', e_1.x, e_1.y);
            this.level.players.forEach(function (p) {
                if ((p === null || p === void 0 ? void 0 : p.z) < 5 && Func_1.default.elipseCollision(e_1, p === null || p === void 0 ? void 0 : p.getBoxElipse())) {
                    p.takeDamage();
                }
            });
        }
    };
    Solid.prototype.setAttackState = function () {
        var _this = this;
        this.state = 'attack';
        this.is_attacking = true;
        this.stateAct = this.attackAct;
        this.action_time = this.attack_speed;
        this.hit_x = this.target.x;
        this.hit_y = this.target.y;
        this.level.addSound('demon roar', this.x, this.y);
        this.cancelAct = function () {
            _this.action = false;
            _this.hit = false;
            _this.is_attacking = false;
        };
        this.setTimerToGetState(this.attack_speed);
    };
    Solid.prototype.idleAct = function () {
        var _this = this;
        if (this.can_check_player) {
            if (!this.target) {
                this.can_check_player = false;
                var p = this.level.players.filter(function (elem) { return Func_1.default.distance(_this, elem) <= _this.player_check_radius && !elem.is_dead; });
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
    return Solid;
}(Enemy_1.Enemy));
exports.default = Solid;
