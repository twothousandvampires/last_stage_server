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
exports.BloodShard = void 0;
var Func_js_1 = require("../../Func.js");
var Projectiles_js_1 = require("./Projectiles.js");
var BloodShard = /** @class */ (function (_super) {
    __extends(BloodShard, _super);
    function BloodShard(level) {
        var _this = _super.call(this, level) || this;
        _this.box_r = 0.8;
        _this.name = 'blood shard';
        _this.move_speed = 0.4;
        _this.w = 2;
        return _this;
    }
    BloodShard.prototype.act = function () {
        if (this.isOutOfMap()) {
            this.impact();
            return;
        }
        for (var i = 0; i < this.level.players.length; i++) {
            var p = this.level.players[i];
            if (!p.is_dead && p.z < this.w && Func_js_1.default.elipseCollision(this.getBoxElipse(), p.getBoxElipse())) {
                p.addLife();
                this.impact();
                return;
            }
        }
        for (var i = 0; i < this.level.enemies.length; i++) {
            var e = this.level.enemies[i];
            if (!e.is_dead && Func_js_1.default.elipseCollision(this.getBoxElipse(), e.getBoxElipse())) {
                e.takeDamage();
                this.impact();
                return;
            }
        }
        var l = 1 - Math.abs(0.5 * Math.cos(this.angle));
        var n_x = Math.sin(this.angle) * l;
        var n_y = Math.cos(this.angle) * l;
        n_x *= this.move_speed;
        n_y *= this.move_speed;
        if (n_x < 0) {
            this.flipped = true;
        }
        else {
            this.flipped = false;
        }
        this.addToPoint(n_x, n_y);
    };
    BloodShard.prototype.impact = function () {
        var _this = this;
        this.level.deleted.push(this.id);
        this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
    };
    return BloodShard;
}(Projectiles_js_1.default));
exports.BloodShard = BloodShard;
