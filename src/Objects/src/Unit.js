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
var GameObject_1 = require("./GameObject");
var Unit = /** @class */ (function (_super) {
    __extends(Unit, _super);
    function Unit(level) {
        var _this = _super.call(this, level) || this;
        _this.move_speed_penalty = 0;
        _this.flipped = false;
        _this.is_attacking = false;
        _this.is_moving = false;
        _this.attack_radius = 0;
        _this.state = 'none';
        _this.is_dead = false;
        _this.hit = false;
        _this.action = false;
        _this.attack_speed = 2000;
        _this.damaged = false;
        _this.life_status = 1;
        _this.armour_rate = 0;
        _this.stunned = false;
        _this.freezed = false;
        _this.shocked = false;
        _this.zaped = false;
        _this.phasing = false;
        _this.can_act = true;
        return _this;
    }
    Unit.prototype.isStatusResist = function () {
        return false;
    };
    Unit.prototype.zapedAct = function () {
    };
    Unit.prototype.setZapedAct = function () {
        var _this = this;
        this.state = 'zaped';
        this.zaped = true;
        this.stateAct = this.zapedAct;
        this.cancelAct = function () {
            _this.zaped = false;
        };
    };
    Unit.prototype.checkArmour = function (unit) {
        if (this.armour_rate === 0)
            return false;
        var check = Func_1.default.chance(this.armour_rate);
        if (!unit || !unit.pierce) {
            return check;
        }
        return !Func_1.default.chance(unit.pierce);
    };
    Unit.prototype.setZap = function (duration) {
        if (duration === void 0) { duration = 100; }
        if (this.is_dead)
            return;
        this.setState(this.setZapedAct);
        this.setTimerToGetState(duration);
    };
    Unit.prototype.setTimerToGetState = function (ms) {
        var _this = this;
        this.getStateTimer = setTimeout(function () {
            _this.getState();
        }, ms);
    };
    Unit.prototype.setStun = function (duration) {
    };
    Unit.prototype.getMoveSpeed = function () {
        var total_inc = this.move_speed_penalty;
        if (!total_inc)
            return this.move_speed;
        if (total_inc > 100)
            total_inc = 100;
        if (total_inc < -90)
            total_inc = -90;
        return this.move_speed * (1 + total_inc / 100);
    };
    Unit.prototype.addMoveSpeedPenalty = function (value) {
        this.move_speed_penalty += value;
    };
    Unit.prototype.succesefulKill = function () {
    };
    Unit.prototype.takeDamage = function (unit, options) {
        if (unit === void 0) { unit = undefined; }
        if (options === void 0) { options = {}; }
    };
    Unit.prototype.setState = function (newState) {
        this.is_moving = false;
        if (this.cancelAct) {
            this.cancelAct();
            this.cancelAct = undefined;
        }
        if (this.getStateTimer) {
            clearTimeout(this.getStateTimer);
            this.getStateTimer = undefined;
        }
        newState.apply(this);
    };
    Unit.prototype.moveByAngle = function (angle) {
        var a = angle;
        var l = 1 - Math.abs(0.5 * Math.cos(a));
        var n_x = Math.sin(a) * l;
        var n_y = Math.cos(a) * l;
        var speed = this.getMoveSpeed();
        n_x *= speed;
        n_y *= speed;
        if (n_x < 0 && !this.is_attacking) {
            this.flipped = true;
        }
        else if (!this.is_attacking) {
            this.flipped = false;
        }
        var x_coll = false;
        var y_coll = false;
        var coll_e_x = undefined;
        var coll_e_y = undefined;
        if (this.isOutOfMap(this.x + n_x, this.y + n_y)) {
            return;
        }
        for (var i = 0; i < this.level.enemies.length; i++) {
            var enemy = this.level.enemies[i];
            if (enemy === this)
                continue;
            if (enemy.phasing)
                continue;
            if (Func_1.default.elipseCollision(this.getBoxElipse(n_x, 0), enemy.getBoxElipse())) {
                x_coll = true;
                n_x = 0;
                coll_e_x = enemy;
                if (y_coll) {
                    break;
                }
            }
            if (Func_1.default.elipseCollision(this.getBoxElipse(0, n_y), enemy.getBoxElipse())) {
                y_coll = true;
                n_y = 0;
                coll_e_y = enemy;
                if (x_coll) {
                    break;
                }
            }
        }
        if (x_coll && n_y === 0) {
            if (this.y <= coll_e_x.y) {
                n_y = -0.4;
            }
            else {
                n_y = 0.4;
            }
        }
        if (y_coll && n_x === 0) {
            if (this.x <= coll_e_y.x) {
                n_x = -0.4;
            }
            else {
                n_x = 0.4;
            }
        }
        this.addToPoint(n_x, n_y);
    };
    Unit.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            state: this.state,
            flipped: this.flipped,
            name: this.name,
            z: this.z,
            action: this.action,
            action_time: this.action_time,
            light_r: this.light_r,
            can_act: this.can_act
        };
    };
    Unit.prototype.succesefulHit = function () {
    };
    Unit.prototype.setFreeze = function (duration) {
        if (this.is_dead)
            return;
        this.setState(this.setFreezeState);
        this.setTimerToGetState(duration);
    };
    Unit.prototype.setFreezeState = function () {
        var _this = this;
        this.freezed = true;
        this.state = 'freezed';
        this.stateAct = this.freezedAct;
        this.cancelAct = function () {
            if (!_this.is_dead) {
                _this.freezed = false;
            }
        };
    };
    Unit.prototype.freezedAct = function () {
    };
    return Unit;
}(GameObject_1.default));
exports.default = Unit;
