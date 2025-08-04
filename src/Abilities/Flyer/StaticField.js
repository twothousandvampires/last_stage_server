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
var StaticFiled_1 = require("../../Objects/Effects/StaticFiled");
var FlyerAbility_1 = require("./FlyerAbility");
var StaticField = /** @class */ (function (_super) {
    __extends(StaticField, _super);
    function StaticField(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cd = false;
        _this.name = 'static field';
        _this.hand_cuffing = false;
        _this.collapse = false;
        return _this;
    }
    StaticField.prototype.canUse = function () {
        return !this.cd;
    };
    StaticField.prototype.use = function () {
        var _this = this;
        if (this.cd)
            return;
        this.cd = true;
        var rel_x = Math.round(this.owner.pressed.over_x + this.owner.x - 40);
        var rel_y = Math.round(this.owner.pressed.over_y + this.owner.y - 40);
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
        var v = this.owner.getMoveSpeedPenaltyValue();
        this.owner.addMoveSpeedPenalty(-v);
        this.owner.stateAct = this.act;
        var cast_speed = this.owner.getCastSpeed();
        this.owner.action_time = cast_speed;
        setTimeout(function () {
            _this.cd = false;
        }, 4000);
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.addMoveSpeedPenalty(v);
            setTimeout(function () {
                _this.owner.hit = false;
                _this.owner.is_attacking = false;
            }, 50);
        };
        this.owner.setTimerToGetState(cast_speed);
    };
    StaticField.prototype.act = function () {
        if (this.action && !this.hit) {
            this.hit = true;
            this.level.addSound('cast', this.x, this.y);
            var e = new StaticFiled_1.default(this.level);
            e.hand_cuffing = this.utility.hand_cuffing;
            e.collapse = this.utility.collapse;
            e.setPoint(this.c_x, this.c_y);
            this.level.bindedEffects.push(e);
        }
    };
    return StaticField;
}(FlyerAbility_1.default));
exports.default = StaticField;
