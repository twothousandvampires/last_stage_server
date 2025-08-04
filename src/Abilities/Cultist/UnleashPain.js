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
var WalkingGhostCultist_1 = require("../../Objects/Effects/WalkingGhostCultist");
var CultistAbility_1 = require("./CultistAbility");
var UnleashPain = /** @class */ (function (_super) {
    __extends(UnleashPain, _super);
    function UnleashPain(owner) {
        var _this = _super.call(this, owner) || this;
        _this.name = 'unleash pain';
        _this.reign_of_pain = false;
        _this.restless_warriors = false;
        _this.cost = 7;
        return _this;
    }
    UnleashPain.prototype.canUse = function () {
        return this.owner.getSecondResource() >= this.cost && this.owner.can_attack;
    };
    UnleashPain.prototype.afterUse = function () {
        var _this = this;
        this.owner.useNotUtilityTriggers.forEach(function (elem) {
            elem.trigger(_this.owner);
        });
    };
    UnleashPain.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.owner.pay_to_cost = this.cost;
        this.owner.can_move_by_player = false;
        this.owner.is_attacking = true;
        this.owner.state = 'attack';
        this.owner.stateAct = this.act;
        var attack_speed = this.owner.getAttackSpeed();
        this.owner.action_time = attack_speed;
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            setTimeout(function () {
                _this.owner.hit = false;
                _this.owner.is_attacking = false;
                _this.owner.can_move_by_player = true;
            }, 50);
        };
        this.owner.setTimerToGetState(attack_speed);
    };
    UnleashPain.prototype.act = function () {
        var _this = this;
        if (this.action && !this.hit) {
            this.hit = true;
            this.level.sounds.push({
                name: 'cast',
                x: this.x,
                y: this.y
            });
            this.payCost();
            var e_1 = this.getBoxElipse();
            e_1.r = 18 + this.getSecondResource();
            var enemy = this.level.enemies.filter(function (elem) {
                return Func_1.default.elipseCollision(elem.getBoxElipse(), e_1);
            });
            var count = 5;
            if (this.third_ab.reign_of_pain) {
                count += this.getSecondResource() * 2;
            }
            var enemyw = enemy.slice(0, 30);
            enemyw.forEach(function (elem) {
                var ghost = new WalkingGhostCultist_1.default(_this.level);
                ghost.target = elem;
                ghost.restless = _this.third_ab.restless_warriors;
                ghost.setPoint(_this.x, _this.y);
                _this.level.bindedEffects.push(ghost);
            });
        }
    };
    return UnleashPain;
}(CultistAbility_1.default));
exports.default = UnleashPain;
