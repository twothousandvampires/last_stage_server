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
var SwordmanAbility_1 = require("./SwordmanAbility");
var Charge = /** @class */ (function (_super) {
    __extends(Charge, _super);
    function Charge(owner) {
        var _this = _super.call(this, owner) || this;
        _this.used = false;
        _this.cost = 4;
        _this.distance = 1200;
        _this.point_added = false;
        _this.hited = [];
        _this.start = false;
        _this.end = false;
        _this.destroyer = false;
        _this.end_timeout = undefined;
        _this.possibilities = false;
        _this.name = 'charge';
        return _this;
    }
    Charge.prototype.canUse = function () {
        return !this.used && this.owner.resource >= this.cost;
    };
    Charge.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.owner.is_attacking = true;
        this.used = true;
        this.start_x = this.owner.x;
        this.start_y = this.owner.y;
        var rel_x = this.owner.pressed.canvas_x + this.owner.x - 40;
        var rel_y = this.owner.pressed.canvas_y + this.owner.y - 40;
        if (rel_x < this.owner.x) {
            this.owner.flipped = true;
        }
        else {
            this.owner.flipped = false;
        }
        this.owner.attack_angle = Func_1.default.angle(this.owner.x, this.owner.y, rel_x, rel_y);
        this.owner.state = 'charge';
        this.owner.can_move_by_player = false;
        this.owner.avoid_damaged_state_chance += 100;
        this.end_timeout = setTimeout(function () {
            _this.end = true;
        }, this.distance);
        this.owner.cancelAct = function () {
            clearTimeout(_this.end_timeout);
            _this.owner.is_attacking = false;
            _this.owner.can_move_by_player = true;
            _this.owner.action = false;
            _this.point_added = false;
            _this.start_x = undefined;
            _this.start_y = undefined;
            _this.start = false;
            _this.end = false;
            _this.hited = [];
            _this.owner.avoid_damaged_state_chance -= 100;
        };
        this.owner.stateAct = this.getAct();
    };
    Charge.prototype.getAct = function () {
        var owner = this.owner;
        var ability = this;
        var second = this.owner.getSecondResource();
        var count = this.owner.getTargetsCount() + second;
        return function () {
            if (ability.end) {
                if (ability.possibilities && ability.hited.length >= 3 && Func_1.default.chance(50 + second)) {
                    owner.addPoint();
                }
                owner.getState();
            }
            else if (owner.action || ability.start) {
                ability.start = true;
                var speed = owner.getMoveSpeed();
                var next_step_x = Math.sin(owner.attack_angle) * speed;
                var next_step_y = Math.cos(owner.attack_angle) * speed;
                if (!owner.isOutOfMap(owner.x + next_step_x, owner.y + next_step_y)) {
                    owner.addToPoint(next_step_x, next_step_y);
                }
                var stun_power_1 = 2000;
                owner.level.enemies.forEach(function (elem) {
                    if (!ability.hited.includes(elem) && Func_1.default.elipseCollision(owner.getBoxElipse(), elem.getBoxElipse())) {
                        ability.hited.push(elem);
                        if (count > 0 && ability.destroyer && Func_1.default.chance(35 + second)) {
                            elem.takeDamage(owner, {
                                explode: true
                            });
                            count--;
                        }
                        if (!elem.is_dead) {
                            elem.setStun(stun_power_1);
                        }
                        if (!ability.point_added) {
                            ability.point_added = true;
                            owner.addPoint();
                        }
                        count--;
                    }
                });
                owner.level.players.forEach(function (elem) {
                    if (elem != owner && !ability.hited.includes(elem) && Func_1.default.elipseCollision(owner.getBoxElipse(), elem.getBoxElipse())) {
                        ability.hited.push(elem);
                        elem.setStun(stun_power_1);
                        if (!ability.point_added) {
                            ability.point_added = true;
                            owner.addPoint();
                        }
                    }
                });
            }
        };
    };
    return Charge;
}(SwordmanAbility_1.default));
exports.default = Charge;
