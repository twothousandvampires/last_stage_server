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
var Jump = /** @class */ (function (_super) {
    __extends(Jump, _super);
    function Jump(owner) {
        var _this = _super.call(this, owner) || this;
        _this.tick = 0;
        _this.total_jump_time = 1200;
        _this.direction = false;
        _this.impact = false;
        _this.cost = 4;
        _this.used = false;
        _this.heavy_landing = false;
        _this.stomp = false;
        _this.name = 'jump';
        return _this;
    }
    Jump.prototype.canUse = function () {
        return !this.used && this.owner.resource >= this.cost;
    };
    Jump.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.used = true;
        var rel_x = this.owner.pressed.canvas_x + this.owner.x - 40;
        var rel_y = this.owner.pressed.canvas_y + this.owner.y - 40;
        if (rel_x < this.owner.x) {
            this.owner.flipped = true;
        }
        else {
            this.owner.flipped = false;
        }
        this.owner.attack_angle = Func_1.default.angle(this.owner.x, this.owner.y, rel_x, rel_y);
        this.distance = Math.sqrt((Math.pow((this.owner.x - rel_x), 2)) + (Math.pow((this.owner.y - rel_y), 2)));
        if (this.distance > 25)
            this.distance = 25;
        if (this.distance < 10)
            this.distance = 10;
        this.move_per_tick = this.distance / Math.floor(this.total_jump_time / 30);
        this.owner.is_attacking = true;
        this.owner.state = 'jump';
        this.owner.can_move_by_player = false;
        setTimeout(function () {
            _this.direction = true;
        }, this.total_jump_time / 2);
        setTimeout(function () {
            _this.impact = true;
        }, this.total_jump_time);
        this.owner.stateAct = this.getAct();
        this.owner.cancelAct = function () {
            _this.used = false;
            _this.owner.z = 0;
            _this.owner.is_attacking = false;
            _this.direction = false;
            _this.impact = false;
            _this.owner.can_move_by_player = true;
        };
    };
    Jump.prototype.getAct = function () {
        var ability = this;
        var owner = this.owner;
        var add_z = 0.7;
        var point_added = false;
        return function () {
            if (ability.impact) {
                var enemies = owner.level.enemies;
                var attack_elipse_1 = owner.getBoxElipse();
                attack_elipse_1.r = owner.attack_radius + (ability.stomp ? 5 : 0);
                var filtered_by_attack_radius = enemies.filter(function (elem) { return Func_1.default.elipseCollision(attack_elipse_1, elem.getBoxElipse()); });
                var count_1 = filtered_by_attack_radius.length;
                if (filtered_by_attack_radius.length) {
                    owner.addPoint();
                    point_added = true;
                }
                filtered_by_attack_radius.forEach(function (elem) {
                    elem.takeDamage(owner);
                });
                filtered_by_attack_radius = owner.level.players.filter(function (elem) { return elem != owner && Func_1.default.elipseCollision(attack_elipse_1, elem.getBoxElipse()); });
                filtered_by_attack_radius.forEach(function (elem) {
                    elem.takeDamage(owner);
                });
                if (filtered_by_attack_radius.length && !point_added) {
                    owner.addPoint();
                }
                if (ability.heavy_landing) {
                    owner.armour_rate += count_1 * 4;
                    setTimeout(function () {
                        owner.armour_rate -= count_1 * 4;
                    }, 5000);
                }
                owner.getState();
                return;
            }
            owner.z += ability.direction ? -add_z : add_z;
            if (ability.direction && add_z < 0.7) {
                add_z += 0.02;
                if (add_z >= 0.7)
                    add_z = 0.7;
            }
            else if (add_z > 0) {
                add_z -= 0.02;
                if (add_z < 0)
                    add_z = 0;
            }
            var next_step_x = Math.sin(owner.attack_angle) * ability.move_per_tick;
            var next_step_y = Math.cos(owner.attack_angle) * ability.move_per_tick;
            if (!owner.isOutOfMap(owner.x + next_step_x, owner.y + next_step_y)) {
                owner.addToPoint(next_step_x, next_step_y);
            }
        };
    };
    return Jump;
}(SwordmanAbility_1.default));
exports.default = Jump;
