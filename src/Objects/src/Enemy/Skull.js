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
var Enemy_1 = require("./Enemy");
var Skull = /** @class */ (function (_super) {
    __extends(Skull, _super);
    function Skull(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'skull';
        _this.box_r = 0.8;
        _this.move_speed = 0.2;
        _this.attack_radius = 1;
        _this.attack_speed = 1100;
        _this.is_spawning = false;
        _this.create_grace_chance = 0;
        _this.create_entity_chance = 0;
        _this.create_energy_chance = 0;
        _this.getState();
        return _this;
    }
    Skull.prototype.setDyingAct = function () {
        this.is_corpse = true;
        if (this.freezed) {
            this.state = 'freeze_dying';
            this.level.sounds.push({
                name: 'shatter',
                x: this.x,
                y: this.y
            });
        }
        else {
            this.state = 'dying';
        }
        this.stateAct = this.DyingAct;
        this.setTimerToGetState(this.dying_time);
    };
    Skull.prototype.moveAct = function () {
        this.state = 'move';
        var a = Func_1.default.angle(this.x, this.y, this.target.x, this.target.y);
        this.moveByAngle(a);
    };
    Skull.prototype.getExplodedSound = function () {
        return {
            name: 'bones explode',
            x: this.x,
            y: this.y
        };
    };
    Skull.prototype.attackAct = function () {
        var _a, _b, _c;
        if (this.action && !this.hit) {
            this.hit = true;
            var e = this.getBoxElipse();
            e.r = this.attack_radius;
            if (((_a = this.target) === null || _a === void 0 ? void 0 : _a.z) < 5 && Func_1.default.elipseCollision(e, (_b = this.target) === null || _b === void 0 ? void 0 : _b.getBoxElipse())) {
                (_c = this.target) === null || _c === void 0 ? void 0 : _c.takeDamage();
            }
        }
    };
    Skull.prototype.getWeaponHitedSound = function () {
        return {
            name: 'hit bones',
            x: this.x,
            y: this.y
        };
    };
    Skull.prototype.setAttackState = function () {
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
    Skull.prototype.idleAct = function () {
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
    return Skull;
}(Enemy_1.Enemy));
exports.default = Skull;
