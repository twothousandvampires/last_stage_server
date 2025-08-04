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
exports.ThrowedWeapon = void 0;
var Func_js_1 = require("../../Func.js");
var Projectiles_js_1 = require("./Projectiles.js");
var ThrowedWeaponShard_js_1 = require("./ThrowedWeaponShard.js");
var ThrowedWeapon = /** @class */ (function (_super) {
    __extends(ThrowedWeapon, _super);
    function ThrowedWeapon(level) {
        var _this = _super.call(this, level) || this;
        _this.box_r = 0.5;
        _this.name = 'throwed_weapon';
        _this.move_speed = 1;
        _this.max_distance = 30;
        _this.hited = [];
        _this.point_added = false;
        _this.returned = false;
        _this.shattered = false;
        _this.can_hit_player = false;
        return _this;
    }
    ThrowedWeapon.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
    };
    ThrowedWeapon.prototype.act = function () {
        var _a, _b, _c;
        if (Math.sqrt((Math.pow((this.x - this.start_x), 2)) + (Math.pow((this.y - this.start_y), 2))) >= this.max_distance + (this.owner.might * 10)) {
            this.impact();
            return;
        }
        var box = this.getBoxElipse();
        box.r = (((_a = this.owner) === null || _a === void 0 ? void 0 : _a.attack_radius) / 10);
        for (var i = 0; i < this.level.players.length; i++) {
            var p = this.level.players[i];
            if ((p != this.owner || (this.can_hit_player && p === this.owner)) && !this.hited.includes(p) && Func_js_1.default.elipseCollision(box, p.getBoxElipse())) {
                this.hited.push(p);
                p.takeDamage(this.owner);
                this.level.addSoundObject(p.getWeaponHitedSound());
                if (!this.point_added) {
                    (_b = this.owner) === null || _b === void 0 ? void 0 : _b.addPoint();
                    this.point_added = true;
                }
                if (this.owner.getTargetsCount() <= this.hited.length) {
                    this.impact();
                }
            }
        }
        for (var i = 0; i < this.level.enemies.length; i++) {
            var e = this.level.enemies[i];
            if (!this.hited.includes(e) && Func_js_1.default.elipseCollision(box, e.getBoxElipse())) {
                this.hited.push(e);
                e.takeDamage(this.owner);
                this.level.addSoundObject(e.getWeaponHitedSound());
                if (!this.point_added) {
                    (_c = this.owner) === null || _c === void 0 ? void 0 : _c.addPoint();
                    this.point_added = true;
                }
                if (this.owner.getTargetsCount() <= this.hited.length) {
                    this.impact();
                }
            }
        }
        var l = 1 - Math.abs(0.5 * Math.cos(this.angle));
        var n_x = Math.sin(this.angle) * l;
        var n_y = Math.cos(this.angle) * l;
        n_x *= this.move_speed;
        n_y *= this.move_speed;
        if (this.isOutOfMap(this.x + n_x, this.y + n_y)) {
            this.impact();
            return;
        }
        else {
            if (n_x < 0) {
                this.flipped = true;
            }
            else {
                this.flipped = false;
            }
            this.addToPoint(n_x, n_y);
        }
    };
    ThrowedWeapon.prototype.impact = function () {
        var _this = this;
        if (this.returned) {
            var returned = new ThrowedWeapon(this.level);
            returned.setOwner(this.owner);
            returned.setPoint(this.x, this.y);
            returned.setAngle(Func_js_1.default.angle(this.x, this.y, this.start_x, this.start_y));
            returned.can_hit_player = true;
            returned.point_added = true;
            this.level.projectiles.push(returned);
        }
        else if (this.shattered) {
            var count = Func_js_1.default.random(1, 3);
            var zones = 6.28 / count;
            for (var i = 1; i <= count; i++) {
                var min_a = (i - 1) * zones;
                var max_a = i * zones;
                var angle = Math.random() * (max_a - min_a) + min_a;
                var proj = new ThrowedWeaponShard_js_1.ThrowedWeaponShard(this.level);
                proj.setAngle(angle);
                proj.setPoint(this.x, this.y);
                proj.setOwner(this.owner);
                this.level.projectiles.push(proj);
            }
        }
        this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
        this.level.deleted.push(this.id);
    };
    return ThrowedWeapon;
}(Projectiles_js_1.default));
exports.ThrowedWeapon = ThrowedWeapon;
