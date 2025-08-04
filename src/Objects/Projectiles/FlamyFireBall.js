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
exports.FlamyFireBall = void 0;
var Func_js_1 = require("../../Func.js");
var FireExplosion_js_1 = require("../Effects/FireExplosion.js");
var Projectiles_js_1 = require("./Projectiles.js");
var FlamyFireBall = /** @class */ (function (_super) {
    __extends(FlamyFireBall, _super);
    function FlamyFireBall(level) {
        var _this = _super.call(this, level) || this;
        _this.box_r = 0.5;
        _this.name = 'flamy_fireball';
        _this.move_speed = 0.25;
        _this.w = 3;
        return _this;
    }
    FlamyFireBall.prototype.act = function () {
        if (this.isOutOfMap()) {
            this.impact();
            return;
        }
        for (var i = 0; i < this.level.players.length; i++) {
            var p = this.level.players[i];
            if (!p.is_dead && p.z < this.w && Func_js_1.default.elipseCollision(this.getBoxElipse(), p.getBoxElipse())) {
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
    FlamyFireBall.prototype.impact = function () {
        var _this = this;
        var effect = new FireExplosion_js_1.default(this.level);
        effect.setPoint(this.x, this.y);
        this.level.addSound('fire explosion', this.x, this.y);
        this.level.effects.push(effect);
        this.level.deleted.push(this.id);
        var explosion = this.getBoxElipse();
        explosion.r = 2;
        this.level.players.forEach(function (p) {
            if (p.z < 5 && Func_js_1.default.elipseCollision(explosion, p.getBoxElipse())) {
                p.takeDamage();
            }
        });
        this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
    };
    return FlamyFireBall;
}(Projectiles_js_1.default));
exports.FlamyFireBall = FlamyFireBall;
