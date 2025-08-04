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
var FrostSphereProjectile_js_1 = require("../Projectiles/FrostSphereProjectile.js");
var FrostSpire_js_1 = require("../src/Piles/FrostSpire.js");
var Effects_js_1 = require("./Effects.js");
var BigFrostNova = /** @class */ (function (_super) {
    __extends(BigFrostNova, _super);
    function BigFrostNova(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'big frostnova';
        _this.r = 8;
        _this.can_act = true;
        _this.stage = 1;
        _this.hited = [];
        _this.w = 2;
        return _this;
    }
    BigFrostNova.prototype.act = function () {
        var _this = this;
        if (this.stage > 3) {
            if (this.genesis) {
                var box_1 = this.getBoxElipse();
                box_1.r = 30;
                var in_radius_1 = this.level.enemies.filter(function (elem) {
                    return !elem.is_dead && Func_js_1.default.elipseCollision(box_1, elem.getBoxElipse());
                });
                this.hited.forEach(function (elem) {
                    if (elem.is_dead) {
                        var p = new FrostSphereProjectile_js_1.FrostSphereProjectile(_this.level);
                        p.setPoint(elem.x, elem.y);
                        p.setOwner(_this.owner);
                        var t = in_radius_1[Math.floor(Math.random() * in_radius_1.length)];
                        if (t) {
                            p.setAngle(Func_js_1.default.angle(elem.x, elem.y, t.x, t.y));
                        }
                        else {
                            p.setAngle(Math.random() * 6.28);
                        }
                        _this.level.projectiles.push(p);
                    }
                });
            }
            if (this.spires) {
                var count = 3;
                var zones = 6.28 / count;
                for (var i = 1; i <= count; i++) {
                    var min_a = (i - 1) * zones;
                    var max_a = i * zones;
                    var angle = Math.random() * (max_a - min_a) + min_a;
                    var x = Func_js_1.default.random(8, 25) * Math.sin(angle);
                    var y = Func_js_1.default.random(8, 25) * Math.cos(angle);
                    var spire = new FrostSpire_js_1.default(this.level);
                    spire.setPoint(this.x + x, this.y + y);
                    this.level.enemies.push(spire);
                }
            }
            this.level.bindedEffects = this.level.bindedEffects.filter(function (e) { return e != _this; });
            this.level.deleted.push(this.id);
            return;
        }
        if (!this.can_act)
            return;
        this.can_act = false;
        var enemies = this.level.enemies;
        var players = this.level.players;
        var targets = enemies.concat(players);
        var wave = this.getBoxElipse();
        wave.r = this.r * (this.stage + this.owner.getAdditionalRadius());
        var filtered = targets.filter(function (elem) { return !elem.is_dead && elem.z < _this.w && !_this.hited.includes(elem) && Func_js_1.default.elipseCollision(wave, elem.getBoxElipse()) && elem != _this.owner; });
        filtered.forEach(function (elem) {
            if (!elem.is_dead && elem.z < _this.w && !_this.hited.includes(elem) && Func_js_1.default.elipseCollision(wave, elem.getBoxElipse()) && elem != _this.owner) {
                _this.hited.push(elem);
                elem.setFreeze(4000);
                if (_this.stage === 1) {
                    elem.takeDamage(_this.owner);
                }
            }
        });
        setTimeout(function () {
            _this.can_act = true;
            _this.stage++;
        }, 200);
    };
    return BigFrostNova;
}(Effects_js_1.default));
exports.default = BigFrostNova;
