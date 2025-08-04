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
var FlameWallObject_1 = require("../../Objects/Projectiles/FlameWallObject");
var FlyerAbility_1 = require("./FlyerAbility");
var FlameWall = /** @class */ (function (_super) {
    __extends(FlameWall, _super);
    function FlameWall(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cost = 4;
        _this.scorching = false;
        _this.frendly_flame = false;
        _this.name = 'flamewall';
        return _this;
    }
    FlameWall.prototype.canUse = function () {
        return this.owner.resource >= this.cost;
    };
    FlameWall.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.owner.pay_to_cost = this.cost;
        var rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40);
        var rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40);
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
            }, 50);
        };
        this.owner.setTimerToGetState(cast_speed);
    };
    FlameWall.prototype.act = function () {
        var _this = this;
        if (this.action && !this.hit) {
            this.payCost();
            this.hit = true;
            this.action = false;
            this.level.addSound('fire massive', this.x, this.y);
            var angles = [0, 0.79, 1.57, 2.36, 3.14, 3.93, 4.71, 5.5];
            angles.forEach(function (a) {
                var l = 1 - Math.abs(0.5 * Math.cos(a));
                var n_x = Math.sin(a) * l * 18;
                var n_y = Math.cos(a) * l * 18;
                var flame = new FlameWallObject_1.FlameWallObject(_this.level, _this.scorching ? 500 : 1000);
                flame.frendly_flame = _this.frendly_flame;
                flame.setOwner(_this);
                flame.setPoint(_this.x + n_x, _this.y + n_y);
                _this.level.projectiles.push(flame);
            });
        }
    };
    return FlameWall;
}(FlyerAbility_1.default));
exports.default = FlameWall;
