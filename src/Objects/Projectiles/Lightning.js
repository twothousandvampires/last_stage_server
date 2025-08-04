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
exports.Lightning = void 0;
var Func_js_1 = require("../../Func.js");
var Projectiles_js_1 = require("./Projectiles.js");
var Lightning = /** @class */ (function (_super) {
    __extends(Lightning, _super);
    function Lightning(level) {
        var _this = _super.call(this, level) || this;
        _this.box_r = 0.5;
        _this.name = 'lightning';
        _this.move_speed = 1.4;
        _this.w = 1;
        return _this;
    }
    Lightning.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
    };
    Lightning.prototype.act = function () {
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
            if (p === this.owner)
                continue;
            if (!p.is_dead && this.w >= p.z && Func_js_1.default.elipseCollision(this.getBoxElipse(), p.getBoxElipse())) {
                p.takeDamage(this.owner);
                this.impact();
                return;
            }
        }
        for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!e.is_dead && Func_js_1.default.elipseCollision(this.getBoxElipse(), e.getBoxElipse())) {
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
    Lightning.prototype.impact = function () {
        var _this = this;
        this.level.deleted.push(this.id);
        this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
    };
    return Lightning;
}(Projectiles_js_1.default));
exports.Lightning = Lightning;
