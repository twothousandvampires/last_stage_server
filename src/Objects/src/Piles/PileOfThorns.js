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
var Func_1 = require("../../../Func");
var Bone_1 = require("../../Projectiles/Bone");
var Pile_1 = require("./Pile");
var PileOfThorns = /** @class */ (function (_super) {
    __extends(PileOfThorns, _super);
    function PileOfThorns(level, power) {
        if (power === void 0) { power = 0; }
        var _this = _super.call(this, level) || this;
        _this.power = power;
        _this.frequency = 4000;
        _this.collection_of_bones = false;
        _this.kill_count = 0;
        _this.getState();
        return _this;
    }
    PileOfThorns.prototype.setDyingAct = function () {
        this.is_dead = true;
        this.state = 'dying';
        if (this.kill_count > 0) {
            var count = this.kill_count;
            var zones = 6.28 / count;
            for (var i = 1; i <= count; i++) {
                var min_a = (i - 1) * zones;
                var max_a = i * zones;
                var angle = Math.random() * (max_a - min_a) + min_a;
                var proj = new Bone_1.Bone(this.level);
                proj.setAngle(angle);
                proj.setPoint(this.x, this.y);
                this.level.projectiles.push(proj);
            }
        }
        this.stateAct = this.DyingAct;
        this.setTimerToGetState(this.dying_time);
    };
    PileOfThorns.prototype.castAct = function () {
        var _this = this;
        if (this.action && !this.hit) {
            this.hit = true;
            this.level.sounds.push({
                name: 'dark cast',
                x: this.x,
                y: this.y
            });
            var e_1 = this.getBoxElipse();
            e_1.r = 10 + this.power;
            this.level.enemies.forEach(function (elem) {
                if (elem != _this && Func_1.default.elipseCollision(elem.getBoxElipse(), e_1)) {
                    elem.takeDamage();
                    if (_this.collection_of_bones && elem.is_dead) {
                        _this.kill_count++;
                    }
                }
            });
        }
    };
    return PileOfThorns;
}(Pile_1.default));
exports.default = PileOfThorns;
