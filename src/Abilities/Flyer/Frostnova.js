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
var BigFrostNova_1 = require("../../Objects/Effects/BigFrostNova");
var FlyerAbility_1 = require("./FlyerAbility");
var Frostnova = /** @class */ (function (_super) {
    __extends(Frostnova, _super);
    function Frostnova(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cost = 7;
        _this.name = 'frost nova';
        _this.ice_genesis = false;
        _this.cold_spires = false;
        return _this;
    }
    Frostnova.prototype.canUse = function () {
        return this.owner.resource >= this.cost;
    };
    Frostnova.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.owner.pay_to_cost = this.cost;
        this.owner.is_attacking = true;
        this.owner.state = 'cast';
        var move_speed_reduce = this.owner.getMoveSpeedPenaltyValue();
        this.owner.addMoveSpeedPenalty(-move_speed_reduce);
        this.owner.stateAct = this.act;
        var cast_speed = this.owner.getCastSpeed();
        this.owner.action_time = cast_speed;
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.addMoveSpeedPenalty(move_speed_reduce);
            _this.owner.hit = false;
            _this.owner.is_attacking = false;
        };
        this.owner.setTimerToGetState(cast_speed);
    };
    Frostnova.prototype.act = function () {
        if (this.action && !this.hit) {
            this.payCost();
            this.level.sounds.push({
                name: 'frost nova',
                x: this.x,
                y: this.y
            });
            this.hit = true;
            var e = new BigFrostNova_1.default(this.level);
            e.spires = this.third_ab.cold_spires;
            e.genesis = this.third_ab.ice_genesis;
            e.setOwner(this);
            e.setPoint(this.x, this.y);
            this.level.bindedEffects.push(e);
        }
    };
    return Frostnova;
}(FlyerAbility_1.default));
exports.default = Frostnova;
