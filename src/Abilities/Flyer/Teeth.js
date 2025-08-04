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
var Tooth_1 = require("../../Objects/Projectiles/Tooth");
var FlyerAbility_1 = require("./FlyerAbility");
var Teeth = /** @class */ (function (_super) {
    __extends(Teeth, _super);
    function Teeth(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cost = 1;
        _this.name = 'teeth';
        return _this;
    }
    Teeth.prototype.canUse = function () {
        return this.owner.resource >= this.cost;
    };
    Teeth.prototype.use = function () {
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
        var v = this.owner.getMoveSpeedPenaltyValue();
        this.owner.addMoveSpeedPenalty(-v);
        this.owner.stateAct = this.act;
        var cast_speed = this.owner.getCastSpeed();
        this.owner.action_time = cast_speed;
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
    Teeth.prototype.act = function () {
        if (this.action && !this.hit) {
            this.payCost();
            this.hit = true;
            this.level.addSound('cast', this.x, this.y);
            var a = undefined;
            var target = this.getTarget();
            if (target) {
                a = Func_1.default.angle(this.x, this.y, target.x, target.y);
            }
            a = a ? a : this.attack_angle;
            var count = 3 + this.getAdditionalRadius();
            if (count > 20) {
                count = 20;
            }
            var zone_per_tooth = 0.2;
            a -= (Math.round(count / 2) * zone_per_tooth);
            for (var i = 1; i <= count; i++) {
                var min_a = a + ((i - 1) * zone_per_tooth);
                var max_a = a + (i * zone_per_tooth);
                var angle = Math.random() * (max_a - min_a) + min_a;
                var proj = new Tooth_1.Tooth(this.level);
                proj.setAngle(angle);
                proj.setPoint(this.x, this.y);
                this.level.projectiles.push(proj);
            }
        }
    };
    return Teeth;
}(FlyerAbility_1.default));
exports.default = Teeth;
