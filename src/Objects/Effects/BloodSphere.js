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
var BloodShard_js_1 = require("../Projectiles/BloodShard.js");
var Effects_js_1 = require("./Effects.js");
var BloodSphere = /** @class */ (function (_super) {
    __extends(BloodSphere, _super);
    function BloodSphere(level, start_power) {
        if (start_power === void 0) { start_power = 0; }
        var _this = _super.call(this, level) || this;
        _this.start_power = start_power;
        _this.name = 'blood sphere';
        _this.time = Date.now();
        _this.box_r = 1.8;
        _this.pool = [];
        _this.z = 8;
        return _this;
    }
    BloodSphere.prototype.explode = function () {
        var count = this.start_power + this.pool.length;
        var zones = 6.28 / count;
        for (var i = 1; i <= count; i++) {
            var min_a = (i - 1) * zones;
            var max_a = i * zones;
            var angle = Math.random() * (max_a - min_a) + min_a;
            var proj = new BloodShard_js_1.BloodShard(this.level);
            proj.setAngle(angle);
            proj.setPoint(this.x, this.y);
            this.level.projectiles.push(proj);
        }
    };
    BloodSphere.prototype.act = function (time) {
        var _this = this;
        if (time - this.time >= 5000) {
            this.explode();
            this.level.deleted.push(this.id);
            this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem != _this; });
            return;
        }
        this.level.enemies.forEach(function (elem) {
            if (elem.is_dead && !_this.pool.includes(elem.id) && Func_js_1.default.elipseCollision(elem.getBoxElipse(), _this.getBoxElipse())) {
                _this.pool.push(elem.id);
            }
        });
    };
    return BloodSphere;
}(Effects_js_1.default));
exports.default = BloodSphere;
