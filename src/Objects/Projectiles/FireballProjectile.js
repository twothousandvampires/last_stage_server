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
exports.FireballProjectile = void 0;
var Func_js_1 = require("../../Func.js");
var FireExplosion_js_1 = require("../Effects/FireExplosion.js");
var FireExplosionMedium_js_1 = require("../Effects/FireExplosionMedium.js");
var FireExplosionSmall_js_1 = require("../Effects/FireExplosionSmall.js");
var FlameWallObject_js_1 = require("./FlameWallObject.js");
var Projectiles_js_1 = require("./Projectiles.js");
var FireballProjectile = /** @class */ (function (_super) {
    __extends(FireballProjectile, _super);
    function FireballProjectile(level, pierce) {
        if (pierce === void 0) { pierce = false; }
        var _this = _super.call(this, level) || this;
        _this.pierce = pierce;
        _this.box_r = 0.7;
        _this.name = 'fireball';
        _this.move_speed = 0.30;
        _this.size = 3;
        _this.traveled = 0;
        _this.max_distance = 35;
        _this.medium_distance = 20;
        _this.min_distance = 10;
        _this.w = 3;
        _this.hitted = [];
        _this.ignite = false;
        return _this;
    }
    FireballProjectile.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
    };
    FireballProjectile.prototype.act = function () {
        var _this = this;
        if (this.isOutOfMap()) {
            this.impact();
            return;
        }
        var enemies = this.level.enemies;
        var players = this.level.players;
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            if (p === this.owner || p.z > this.w)
                continue;
            if (Func_js_1.default.elipseCollision(this.getBoxElipse(), p.getBoxElipse()) && !this.hitted.includes(p.id)) {
                this.hitted.push(p.id);
                this.impact();
                return;
            }
        }
        for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (Func_js_1.default.elipseCollision(this.getBoxElipse(), e.getBoxElipse()) && !this.hitted.includes(e.id)) {
                this.hitted.push(e.id);
                this.impact();
                return;
            }
        }
        this.traveled = Math.sqrt((Math.pow((this.x - this.start_x), 2)) + (Math.pow((this.y - this.start_y), 2)));
        if (this.traveled >= this.max_distance) {
            this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
            this.level.deleted.push(this.id);
            return;
        }
        else if (this.traveled > this.medium_distance && this.size === 2) {
            this.size = 1;
            this.name = 'small fireball';
            this.move_speed = 0.15;
        }
        else if (this.traveled > this.min_distance && this.size === 3) {
            this.size = 2;
            this.name = 'medium fireball';
            this.move_speed = 0.20;
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
    FireballProjectile.prototype.impact = function () {
        var _this = this;
        var add_radius = this.owner.getAdditionalRadius();
        var effect = undefined;
        var explosion_radius = 0;
        this.level.addSound('fire explosion', this.x, this.y);
        if (this.size === 3) {
            effect = new FireExplosion_js_1.default(this.level);
            explosion_radius = 6 + add_radius;
        }
        else if (this.size === 2) {
            effect = new FireExplosionMedium_js_1.default(this.level);
            explosion_radius = 4 + add_radius;
        }
        else {
            effect = new FireExplosionSmall_js_1.default(this.level);
            explosion_radius = 2 + add_radius;
        }
        if (this.ignite) {
            explosion_radius = 1;
        }
        effect.setPoint(this.x, this.y);
        this.level.effects.push(effect);
        this.level.deleted.push(this.id);
        var explosion = this.getBoxElipse();
        explosion.r = explosion_radius;
        this.level.players.forEach(function (p) {
            if (Func_js_1.default.elipseCollision(explosion, p.getBoxElipse())) {
                p.takeDamage(_this.owner, {
                    burn: true
                });
            }
        });
        this.level.enemies.forEach(function (p) {
            if (Func_js_1.default.elipseCollision(explosion, p.getBoxElipse())) {
                p.takeDamage(_this.owner, {
                    burn: true
                });
            }
        });
        if (this.ignite) {
            var fire = new FlameWallObject_js_1.FlameWallObject(this.level);
            fire.setPoint(this.x, this.y);
            this.level.projectiles.push(fire);
        }
        if (this.pierce && Func_js_1.default.chance(30)) {
        }
        else {
            this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
        }
    };
    return FireballProjectile;
}(Projectiles_js_1.default));
exports.FireballProjectile = FireballProjectile;
