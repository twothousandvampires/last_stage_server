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
exports.Flamy = void 0;
var Func_1 = require("../../../Func");
var FlamyFireBall_1 = require("../../Projectiles/FlamyFireBall");
var Enemy_1 = require("./Enemy");
var Flamy = /** @class */ (function (_super) {
    __extends(Flamy, _super);
    function Flamy(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'flamy';
        _this.box_r = 2;
        _this.move_speed = 0.4;
        _this.attack_radius = 5;
        _this.attack_speed = 3000;
        _this.retreat_distance = 10;
        _this.retreat_angle = undefined;
        _this.spawn_time = 1400;
        _this.getState();
        return _this;
    }
    Flamy.prototype.idleAct = function () {
        var _this = this;
        if (this.can_check_player) {
            if (!this.target) {
                this.can_check_player = false;
                var p = this.level.players.filter(function (elem) { return Func_1.default.distance(_this, elem) <= _this.player_check_radius && !elem.is_dead; });
                p.sort(function (a, b) {
                    return Func_1.default.distance(a, _this) - Func_1.default.distance(b, _this);
                });
                this.target = p[0];
            }
            else {
                if (Func_1.default.distance(this, this.target) >= this.player_check_radius || this.target.is_dead) {
                    this.target = undefined;
                }
            }
            setTimeout(function () {
                _this.can_check_player = true;
            }, 2000);
        }
        if (!this.target) {
            return;
        }
        if (Func_1.default.distance(this, this.target) <= this.retreat_distance && Math.random() > 0.5) {
            this.setState(this.setRetreatState);
        }
        else {
            this.setState(this.setAttackState);
        }
    };
    Flamy.prototype.retreatAct = function () {
        var a = this.retreat_angle;
        if (!a)
            return;
        this.moveByAngle(a);
    };
    Flamy.prototype.setRetreatState = function () {
        var _this = this;
        var _a;
        this.state = 'move';
        this.retreat_angle = Func_1.default.angle((_a = this.target) === null || _a === void 0 ? void 0 : _a.x, this.target.y, this.x, this.y);
        this.stateAct = this.retreatAct;
        this.cancelAct = function () {
            _this.retreat_angle = undefined;
        };
        this.setTimerToGetState(2000);
    };
    Flamy.prototype.attackAct = function () {
        if (this.action && !this.hit) {
            this.hit = true;
            var fb = new FlamyFireBall_1.FlamyFireBall(this.level, this.x, this.y);
            fb.setAngle(Func_1.default.angle(this.x, this.y, this.target.x, this.target.y));
            fb.setOwner(this);
            fb.setPoint(this.x, this.y);
            this.level.projectiles.push(fb);
        }
    };
    return Flamy;
}(Enemy_1.Enemy));
exports.Flamy = Flamy;
