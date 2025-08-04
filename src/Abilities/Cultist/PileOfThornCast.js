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
var PileOfThorns_1 = require("../../Objects/src/Piles/PileOfThorns");
var PileOfThornCast = /** @class */ (function (_super) {
    __extends(PileOfThornCast, _super);
    function PileOfThornCast(owner) {
        var _this = _super.call(this, owner) || this;
        _this.name = 'pile of thorns';
        _this.distance = 25;
        _this.ring_of_pain = false;
        _this.collection_of_bones = false;
        _this.cost = 5;
        return _this;
    }
    PileOfThornCast.prototype.canUse = function () {
        return this.owner.getSecondResource() >= this.cost && this.owner.can_cast;
    };
    PileOfThornCast.prototype.afterUse = function () {
        var _this = this;
        this.owner.useNotUtilityTriggers.forEach(function (elem) {
            elem.trigger(_this.owner);
        });
        this.owner.last_skill_used_time = this.owner.time;
    };
    PileOfThornCast.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        var rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40);
        var rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40);
        this.owner.pay_to_cost = this.cost;
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
        this.owner.state = 'cast';
        this.owner.addMoveSpeedPenalty(-70);
        this.owner.stateAct = this.act;
        var cast_speed = this.owner.getCastSpeed();
        this.owner.action_time = cast_speed;
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.addMoveSpeedPenalty(70);
            setTimeout(function () {
                _this.owner.hit = false;
                _this.owner.is_attacking = false;
                _this.owner.hit_x = undefined;
                _this.owner.hit_y = undefined;
            }, 50);
        };
        this.owner.setTimerToGetState(cast_speed);
    };
    PileOfThornCast.prototype.act = function () {
        if (this.action && !this.hit) {
            this.hit = true;
            this.level.sounds.push({
                name: 'dark cast',
                x: this.x,
                y: this.y
            });
            this.payCost();
            var rel_distance = Math.sqrt((Math.pow((this.x - this.c_x), 2)) + (Math.pow((this.y - this.c_y), 2)));
            var distance = rel_distance > this.first_ab.distance ? this.first_ab.distance : rel_distance;
            var hit_x = this.x + (Math.sin(this.attack_angle) * distance);
            var hit_y = this.y + (Math.cos(this.attack_angle) * distance);
            var totem_power = this.getSecondResource();
            var pile = new PileOfThorns_1.default(this.level, totem_power);
            pile.collection_of_bones = this.third_ab.collection_of_bones;
            if (this.third_ab.ring_of_pain) {
                pile.frequency = 2500;
            }
            pile.setPoint(hit_x, hit_y);
            this.level.enemies.push(pile);
        }
    };
    return PileOfThornCast;
}(CultistAbility_1.default));
exports.default = PileOfThornCast;
