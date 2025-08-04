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
var Func_js_1 = require("../../Func.js");
var AttackingGhostCultist_js_1 = require("./AttackingGhostCultist.js");
var Effects_js_1 = require("./Effects.js");
var WalkingGhostCultist = /** @class */ (function (_super) {
    __extends(WalkingGhostCultist, _super);
    function WalkingGhostCultist(level, start_power) {
        if (start_power === void 0) { start_power = 0; }
        var _this = _super.call(this, level) || this;
        _this.start_power = start_power;
        _this.name = 'walking ghost cultist';
        _this.move_speed = 0.4;
        _this.box_r = 2;
        _this.flipped = false;
        _this.restless = false;
        return _this;
    }
    WalkingGhostCultist.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            name: this.name,
            z: this.z,
            light_r: this.light_r,
            flipped: this.flipped
        };
    };
    WalkingGhostCultist.prototype.delete = function () {
        var _this = this;
        this.level.deleted.push(this.id);
        this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem != _this; });
    };
    WalkingGhostCultist.prototype.explode = function (time) {
        var sprite = new AttackingGhostCultist_js_1.default(this.level);
        sprite.restless = this.restless;
        sprite.start = time;
        sprite.setPoint(this.x, this.y);
        sprite.hit_x = this.target.x;
        sprite.hit_y = this.target.y;
        this.level.bindedEffects.push(sprite);
        this.delete();
    };
    WalkingGhostCultist.prototype.act = function (time) {
        if (this.target.is_dead) {
            this.delete();
            return;
        }
        if (Func_js_1.default.elipseCollision(this.getBoxElipse(), this.target.getBoxElipse())) {
            this.explode(time);
        }
        else {
            var angle = Func_js_1.default.angle(this.x, this.y, this.target.x, this.target.y);
            var l = 1 - Math.abs(0.5 * Math.cos(angle));
            var n_x = Math.sin(angle) * l;
            var n_y = Math.cos(angle) * l;
            n_x *= this.move_speed;
            n_y *= this.move_speed;
            if (n_x < 0) {
                this.flipped = true;
            }
            else {
                this.flipped = false;
            }
            this.addToPoint(n_x, n_y);
        }
    };
    return WalkingGhostCultist;
}(Effects_js_1.default));
exports.default = WalkingGhostCultist;
