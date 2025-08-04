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
var Effects_js_1 = require("./Effects.js");
var WalkingGhostCultist_js_1 = require("./WalkingGhostCultist.js");
var AttackingGhostCultist = /** @class */ (function (_super) {
    __extends(AttackingGhostCultist, _super);
    function AttackingGhostCultist(level, start_power) {
        if (start_power === void 0) { start_power = 0; }
        var _this = _super.call(this, level) || this;
        _this.start_power = start_power;
        _this.name = 'attacking ghost cultist';
        _this.move_speed = 0;
        _this.box_r = 2;
        _this.flipped = false;
        _this.action_time = 1500;
        _this.restless = false;
        return _this;
    }
    AttackingGhostCultist.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            name: this.name,
            z: this.z,
            light_r: this.light_r,
            flipped: this.flipped,
            action_time: this.action_time
        };
    };
    AttackingGhostCultist.prototype.delete = function () {
        var _this = this;
        this.level.deleted.push(this.id);
        this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem != _this; });
    };
    AttackingGhostCultist.prototype.explode = function () {
        if (this.restless) {
            var ghost = new WalkingGhostCultist_js_1.default(this.level);
            if (this.target && !this.target.is_dead) {
                ghost.target = this.target;
            }
            else {
                var e_1 = this.getBoxElipse();
                e_1.r = 15;
                var enemy = this.level.enemies.filter(function (elem) {
                    return Func_js_1.default.elipseCollision(elem.getBoxElipse(), e_1);
                });
                ghost.target = enemy[Math.floor(Math.random() * enemy.length)];
            }
            if (ghost.target) {
                ghost.setPoint(this.x, this.y);
                this.level.bindedEffects.push(ghost);
            }
            this.delete();
        }
        else {
            this.delete();
        }
        this.delete();
    };
    AttackingGhostCultist.prototype.act = function (time) {
        if (time - this.start >= this.action_time) {
            if (!this.hit_x || !this.hit_y)
                return;
            var e_2 = this.getBoxElipse();
            e_2.r = 8;
            e_2.x = this.hit_x;
            e_2.y = this.hit_y;
            this.level.enemies.forEach(function (elem) {
                if (Func_js_1.default.elipseCollision(elem.getBoxElipse(), e_2)) {
                    elem.takeDamage();
                }
            });
            this.explode();
        }
    };
    return AttackingGhostCultist;
}(Effects_js_1.default));
exports.default = AttackingGhostCultist;
