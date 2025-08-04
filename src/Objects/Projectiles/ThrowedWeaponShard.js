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
exports.ThrowedWeaponShard = void 0;
var Func_js_1 = require("../../Func.js");
var Projectiles_js_1 = require("./Projectiles.js");
var ThrowedWeaponShard = /** @class */ (function (_super) {
    __extends(ThrowedWeaponShard, _super);
    function ThrowedWeaponShard(level) {
        var _this = _super.call(this, level) || this;
        _this.box_r = 0.5;
        _this.name = 'weapon fragment';
        _this.move_speed = 1;
        _this.max_distance = 18;
        _this.point_added = false;
        return _this;
    }
    ThrowedWeaponShard.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
    };
    ThrowedWeaponShard.prototype.act = function () {
        var _a, _b;
        if (Math.sqrt((Math.pow((this.x - this.start_x), 2)) + (Math.pow((this.y - this.start_y), 2))) >= this.max_distance) {
            this.impact();
            return;
        }
        if (this.isOutOfMap()) {
            this.impact();
            return;
        }
        for (var i = 0; i < this.level.players.length; i++) {
            var p = this.level.players[i];
            if (Func_js_1.default.elipseCollision(this.getBoxElipse(), p.getBoxElipse())) {
                p.takeDamage(this.owner);
                this.level.addSoundObject(p.getWeaponHitedSound());
                if (!this.point_added) {
                    (_a = this.owner) === null || _a === void 0 ? void 0 : _a.addPoint();
                    this.point_added = true;
                }
                this.impact();
            }
        }
        for (var i = 0; i < this.level.enemies.length; i++) {
            var e = this.level.enemies[i];
            if (!e.is_dead && Func_js_1.default.elipseCollision(this.getBoxElipse(), e.getBoxElipse())) {
                e.takeDamage(this.owner);
                this.level.addSoundObject(e.getWeaponHitedSound());
                if (!this.point_added) {
                    (_b = this.owner) === null || _b === void 0 ? void 0 : _b.addPoint();
                    this.point_added = true;
                }
                this.impact();
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
    ThrowedWeaponShard.prototype.impact = function () {
        var _this = this;
        this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
        this.level.deleted.push(this.id);
    };
    return ThrowedWeaponShard;
}(Projectiles_js_1.default));
exports.ThrowedWeaponShard = ThrowedWeaponShard;
