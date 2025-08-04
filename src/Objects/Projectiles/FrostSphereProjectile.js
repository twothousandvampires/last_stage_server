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
exports.FrostSphereProjectile = void 0;
var Func_js_1 = require("../../Func.js");
var FrostExplosionBig_js_1 = require("../Effects/FrostExplosionBig.js");
var FrostExplosionMedium_js_1 = require("../Effects/FrostExplosionMedium.js");
var FrostExplosionSmall_js_1 = require("../Effects/FrostExplosionSmall.js");
var Projectiles_js_1 = require("./Projectiles.js");
var FrostSphereProjectile = /** @class */ (function (_super) {
    __extends(FrostSphereProjectile, _super);
    function FrostSphereProjectile(level) {
        var _this = _super.call(this, level) || this;
        _this.box_r = 0.8;
        _this.name = 'big frost sphere';
        _this.move_speed = 0.25;
        _this.size = 3;
        _this.traveled = 0;
        _this.max_distance = 35;
        _this.medium_distance = 20;
        _this.min_distance = 10;
        _this.w = 3;
        _this.frost_rich = false;
        _this.reign_of_frost = false;
        return _this;
    }
    FrostSphereProjectile.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
    };
    FrostSphereProjectile.prototype.act = function () {
        var _this = this;
        if (this.isOutOfMap()) {
            this.impact();
            return;
        }
        var enemies = this.level.enemies;
        var players = this.level.players;
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            if (p === this.owner || this.w < p.z)
                continue;
            if (Func_js_1.default.elipseCollision(this.getBoxElipse(), p.getBoxElipse())) {
                this.impact();
                return;
            }
        }
        for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!e.is_dead && Func_js_1.default.elipseCollision(this.getBoxElipse(), e.getBoxElipse())) {
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
            this.name = 'small frost sphere';
        }
        else if (this.traveled > this.min_distance && this.size === 3) {
            this.size = 2;
            this.name = 'medium frost sphere';
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
    FrostSphereProjectile.prototype.impact = function () {
        var _this = this;
        var effect = undefined;
        var explosion_radius = 0;
        var add_radius = (this === null || this === void 0 ? void 0 : this.owner) ? this === null || this === void 0 ? void 0 : this.owner.getAdditionalRadius() : 0;
        if (this.size === 3) {
            effect = new FrostExplosionBig_js_1.default(this.level);
            explosion_radius = 6 + add_radius;
        }
        else if (this.size === 2) {
            effect = new FrostExplosionMedium_js_1.default(this.level);
            explosion_radius = 4 + add_radius;
        }
        else {
            effect = new FrostExplosionSmall_js_1.default(this.level);
            explosion_radius = 2 + add_radius;
        }
        if (this.frost_rich) {
            explosion_radius += 3;
        }
        effect.setPoint(this.x, this.y);
        this.level.effects.push(effect);
        this.level.deleted.push(this.id);
        var explosion = this.getBoxElipse();
        explosion.r = explosion_radius;
        var freeze_duration = 2000;
        if (this.reign_of_frost) {
            freeze_duration += 1000;
        }
        this.level.players.forEach(function (p) {
            if (Func_js_1.default.elipseCollision(explosion, p.getBoxElipse())) {
                if (p !== _this.owner) {
                    if (p.freezed) {
                        p.takeDamage(_this.owner, {
                            instant_death: true
                        });
                    }
                    else {
                        p.setFreeze(freeze_duration);
                    }
                }
            }
        });
        this.level.enemies.forEach(function (p) {
            if (Func_js_1.default.elipseCollision(explosion, p.getBoxElipse())) {
                if (p.freezed) {
                    p.takeDamage(_this.owner, {
                        instant_death: true
                    });
                }
                else {
                    p.setFreeze(freeze_duration);
                }
            }
        });
        this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
    };
    return FrostSphereProjectile;
}(Projectiles_js_1.default));
exports.FrostSphereProjectile = FrostSphereProjectile;
