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
exports.ForkedLightningProjectile = void 0;
var Func_js_1 = require("../../Func.js");
var Projectiles_js_1 = require("./Projectiles.js");
var ForkedLightningProjectile = /** @class */ (function (_super) {
    __extends(ForkedLightningProjectile, _super);
    function ForkedLightningProjectile(level, hitted_ids, chance_to_fork) {
        if (hitted_ids === void 0) { hitted_ids = []; }
        if (chance_to_fork === void 0) { chance_to_fork = 100; }
        var _this = _super.call(this, level) || this;
        _this.hitted_ids = hitted_ids;
        _this.chance_to_fork = chance_to_fork;
        _this.box_r = 0.5;
        _this.name = 'lightning';
        _this.move_speed = 1.5;
        _this.w = 1;
        _this.check_rasius = 15;
        _this.improved_chain_reaction = false;
        _this.lightning_eye = false;
        return _this;
    }
    ForkedLightningProjectile.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
    };
    ForkedLightningProjectile.prototype.act = function () {
        var _this = this;
        if (this.isOutOfMap()) {
            this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
            this.level.deleted.push(this.id);
            return;
        }
        var enemies = this.level.enemies;
        var players = this.level.players;
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            if (p === this.owner || this.w < p.z)
                continue;
            if (!p.is_dead && Func_js_1.default.elipseCollision(this.getBoxElipse(), p.getBoxElipse()) && !this.hitted_ids.includes(p.id)) {
                this.hitted_ids.push(p.id);
                p.takeDamage(this.owner);
                this.impact();
                return;
            }
        }
        for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!e.is_dead && Func_js_1.default.elipseCollision(this.getBoxElipse(), e.getBoxElipse()) && !this.hitted_ids.includes(e.id)) {
                this.hitted_ids.push(e.id);
                e.takeDamage(this.owner);
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
    ForkedLightningProjectile.prototype.impact = function () {
        var _this = this;
        var targets = [];
        var radius = this.lightning_eye ? 30 : this.check_rasius;
        var max_for_serching_targets = 3 + this.owner.getAdditionalRadius();
        this.level.players.forEach(function (p) {
            if (!p.is_dead && targets.length < max_for_serching_targets && Func_js_1.default.distance(_this, p) <= radius && p != _this.owner && !_this.hitted_ids.includes(p.id)) {
                targets.push(p);
            }
        });
        this.level.enemies.forEach(function (p) {
            if (!p.is_dead && targets.length < max_for_serching_targets && Func_js_1.default.distance(_this, p) <= radius && !_this.hitted_ids.includes(p.id)) {
                targets.push(p);
            }
        });
        targets.forEach(function (elem) {
            if (Func_js_1.default.chance(_this.chance_to_fork)) {
                var reduce_chance = _this.improved_chain_reaction ? 15 : 30;
                var proj = new ForkedLightningProjectile(_this.level, _this.hitted_ids, reduce_chance);
                proj.improved_chain_reaction = _this.improved_chain_reaction;
                proj.lightning_eye = _this.lightning_eye;
                var angle = Func_js_1.default.angle(_this.x, _this.y, elem.x, elem.y);
                proj.setOwner(_this.owner);
                proj.setAngle(angle);
                proj.setPoint(_this.x, _this.y);
                _this.level.projectiles.push(proj);
            }
        });
        this.level.deleted.push(this.id);
        this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
    };
    return ForkedLightningProjectile;
}(Projectiles_js_1.default));
exports.ForkedLightningProjectile = ForkedLightningProjectile;
