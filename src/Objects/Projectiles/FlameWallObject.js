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
exports.FlameWallObject = void 0;
var Func_js_1 = require("../../Func.js");
var Projectiles_js_1 = require("./Projectiles.js");
var FlameWallObject = /** @class */ (function (_super) {
    __extends(FlameWallObject, _super);
    function FlameWallObject(level, burn_time, duration) {
        if (burn_time === void 0) { burn_time = 1000; }
        if (duration === void 0) { duration = 3000; }
        var _this = _super.call(this, level) || this;
        _this.burn_time = burn_time;
        _this.duration = duration;
        _this.box_r = 1;
        _this.name = 'flame';
        _this.move_speed = 0;
        _this.interval = undefined;
        _this.hitted = [];
        _this.light_r = 6;
        _this.w = 8;
        _this.frendly_flame = false;
        _this.start();
        return _this;
    }
    FlameWallObject.prototype.setOwner = function (owner) {
        this.owner = owner;
    };
    FlameWallObject.prototype.start = function () {
        var _this = this;
        setTimeout(function () {
            clearInterval(_this.interval);
            _this.level.deleted.push(_this.id);
            _this.level.projectiles = _this.level.projectiles.filter(function (elem) { return elem != _this; });
        }, this.duration);
        setTimeout(function () {
            _this.interval = setInterval(function () {
                _this.hitted = [];
            }, _this.burn_time);
        }, this.burn_time);
    };
    FlameWallObject.prototype.act = function () {
        var enemies = this.level.enemies;
        var players = this.level.players;
        if (!this.frendly_flame) {
            for (var i = 0; i < players.length; i++) {
                var p = players[i];
                if (p.z < this.w && !this.hitted.includes(p) && Func_js_1.default.elipseCollision(this.getBoxElipse(), p.getBoxElipse())) {
                    p.takeDamage(undefined, {
                        burn: true
                    });
                    this.hitted.push(p);
                }
            }
        }
        for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!this.hitted.includes(e) && Func_js_1.default.elipseCollision(this.getBoxElipse(), e.getBoxElipse())) {
                e.takeDamage(undefined, {
                    burn: true
                });
                this.hitted.push(e);
            }
        }
    };
    FlameWallObject.prototype.impact = function () {
    };
    return FlameWallObject;
}(Projectiles_js_1.default));
exports.FlameWallObject = FlameWallObject;
