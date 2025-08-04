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
exports.InfernoFlame = void 0;
var Func_js_1 = require("../../Func.js");
var Projectiles_js_1 = require("./Projectiles.js");
var InfernoFlame = /** @class */ (function (_super) {
    __extends(InfernoFlame, _super);
    function InfernoFlame(level) {
        var _this = _super.call(this, level) || this;
        _this.box_r = 1;
        _this.name = 'flame';
        _this.move_speed = 0.6;
        _this.hitted = [];
        _this.light_r = 6;
        _this.w = 8;
        _this.start_time = Date.now();
        return _this;
    }
    InfernoFlame.prototype.act = function (tick) {
        var _this = this;
        if (tick - this.start_time >= 5000) {
            this.level.deleted.push(this.id);
            this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
            return;
        }
        var enemies = this.level.enemies;
        var players = this.level.players;
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            if (p === this.owner)
                continue;
            if (p.z < this.w && !this.hitted.includes(p.id) && Func_js_1.default.elipseCollision(this.getBoxElipse(), p.getBoxElipse())) {
                p.takeDamage(undefined, {
                    burn: true
                });
                this.hitted.push(p.id);
            }
        }
        for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!this.hitted.includes(e.id) && Func_js_1.default.elipseCollision(this.getBoxElipse(), e.getBoxElipse())) {
                e.takeDamage(undefined, {
                    burn: true
                });
                this.hitted.push(e.id);
            }
        }
        var l = 1 - Math.abs(0.5 * Math.cos(this.angle));
        var n_x = Math.sin(this.angle) * l;
        var n_y = Math.cos(this.angle) * l;
        n_x *= this.move_speed;
        n_y *= this.move_speed;
        this.addToPoint(n_x, n_y);
        this.angle += 0.05;
        this.move_speed += 0.005;
    };
    InfernoFlame.prototype.impact = function () {
    };
    return InfernoFlame;
}(Projectiles_js_1.default));
exports.InfernoFlame = InfernoFlame;
