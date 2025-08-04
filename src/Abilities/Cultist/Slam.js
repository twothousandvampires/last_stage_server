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
var CultistAbility_1 = require("./CultistAbility");
var Slam = /** @class */ (function (_super) {
    __extends(Slam, _super);
    function Slam(owner) {
        var _this = _super.call(this, owner) || this;
        _this.name = 'slam';
        _this.cost = 0;
        _this.slaming = false;
        _this.soul_extraction = false;
        return _this;
    }
    Slam.prototype.canUse = function () {
        return this.owner.can_attack;
    };
    Slam.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        var rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40);
        var rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40);
        this.owner.c_x = rel_x;
        this.owner.c_y = rel_y;
        if (rel_x < this.owner.x) {
            this.owner.flipped = true;
        }
        else {
            this.owner.flipped = false;
        }
        this.owner.attack_angle = Func_1.default.angle(this.owner.x, this.owner.y, rel_x, rel_y);
        this.owner.is_attacking = true;
        this.owner.state = 'attack';
        var move_speed_reduce = this.owner.getMoveSpeedReduceWhenUseSkill();
        this.owner.addMoveSpeedPenalty(-move_speed_reduce);
        this.owner.stateAct = this.act;
        var attack_speed = this.owner.getAttackSpeed();
        this.owner.action_time = attack_speed;
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.addMoveSpeedPenalty(move_speed_reduce);
            setTimeout(function () {
                _this.owner.hit = false;
                _this.owner.is_attacking = false;
                _this.owner.hit_x = undefined;
                _this.owner.hit_y = undefined;
            }, 50);
        };
        this.owner.setTimerToGetState(attack_speed);
    };
    Slam.prototype.act = function () {
        var _this = this;
        if (this.action && !this.hit) {
            var second_resource = this.getSecondResource();
            if (this.first_ab.soul_extraction) {
                this.additional_chance_grace_create += 10;
            }
            this.hit = true;
            var enemies = this.level.enemies;
            var players = this.level.players;
            var rel_distance = Math.sqrt((Math.pow((this.x - this.c_x), 2)) + (Math.pow((this.y - this.c_y), 2)));
            var total_radius = this.attack_radius + Math.round(second_resource / 2);
            var distance = rel_distance > total_radius ? total_radius : rel_distance;
            var hit_x = this.x + (Math.sin(this.attack_angle) * distance);
            var hit_y = this.y + (Math.cos(this.attack_angle) * distance);
            var r_1 = this.getBoxElipse();
            r_1.r = this.attack_point_radius;
            r_1.x = hit_x;
            r_1.y = hit_y;
            if (this.first_ab.slaming) {
                r_1.r += 2;
            }
            this.level.sounds.push({
                name: 'blow',
                x: this.x,
                y: this.y
            });
            var f = enemies.filter(function (elem) { return Func_1.default.elipseCollision(r_1, elem.getBoxElipse()); });
            var p = players.filter(function (elem) { return Func_1.default.elipseCollision(r_1, elem.getBoxElipse()) && elem != _this; });
            this.target = undefined;
            f.concat(p).forEach(function (elem) {
                elem.takeDamage(_this);
            });
            if (this.first_ab.soul_extraction) {
                this.additional_chance_grace_create -= 10;
            }
        }
    };
    return Slam;
}(CultistAbility_1.default));
exports.default = Slam;
