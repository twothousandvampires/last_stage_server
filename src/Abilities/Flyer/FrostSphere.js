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
var FrostSphereProjectile_1 = require("../../Objects/Projectiles/FrostSphereProjectile");
var FlyerAbility_1 = require("./FlyerAbility");
var FrostSphere = /** @class */ (function (_super) {
    __extends(FrostSphere, _super);
    function FrostSphere(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cost = 1;
        _this.name = 'frost sphere';
        _this.frost_rich = false;
        _this.reign_of_frost = false;
        return _this;
    }
    FrostSphere.prototype.canUse = function () {
        return this.owner.resource >= this.cost;
    };
    FrostSphere.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.owner.pay_to_cost = this.cost;
        if (rel_x < this.owner.x) {
            this.owner.flipped = true;
        }
        else {
            this.owner.flipped = false;
        }
        var rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40);
        var rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40);
        var angle = Func_1.default.angle(this.owner.x, this.owner.y, rel_x, rel_y);
        this.owner.attack_angle = angle;
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
            setTimeout(function () {
                _this.owner.hit = false;
                _this.owner.is_attacking = false;
            }, 50);
        };
        this.owner.setTimerToGetState(cast_speed);
    };
    FrostSphere.prototype.act = function () {
        if (this.action && !this.hit) {
            this.payCost();
            this.hit = true;
            this.level.addSound('cold cast', this.x, this.y);
            var a = undefined;
            var target = this.getTarget();
            if (target) {
                a = Func_1.default.angle(this.x, this.y, target.x, target.y);
            }
            this.target = undefined;
            var proj = new FrostSphereProjectile_1.FrostSphereProjectile(this.level);
            proj.frost_rich = this.frost_rich;
            proj.reign_of_frost = this.reign_of_frost;
            proj.setOwner(this);
            proj.setAngle(a ? a : this.attack_angle);
            proj.setPoint(this.x, this.y);
            this.level.projectiles.push(proj);
        }
    };
    return FrostSphere;
}(FlyerAbility_1.default));
exports.default = FrostSphere;
