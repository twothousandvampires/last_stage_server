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
exports.Tooth = void 0;
var Func_js_1 = require("../../Func.js");
var ToothExplode_js_1 = require("../Effects/ToothExplode.js");
var Projectiles_js_1 = require("./Projectiles.js");
var Tooth = /** @class */ (function (_super) {
    __extends(Tooth, _super);
    function Tooth(level) {
        var _this = _super.call(this, level) || this;
        _this.box_r = 0.3;
        _this.name = 'tooth';
        _this.move_speed = 0.6;
        _this.state = 0;
        _this.w = 3;
        _this.max_distance = 35;
        _this.medium_distance = 20;
        _this.min_distance = 10;
        return _this;
    }
    Tooth.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
    };
    Tooth.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            state: this.state,
            z: this.z,
            flipped: this.flipped,
            name: this.name
        };
    };
    Tooth.prototype.act = function () {
        var _this = this;
        if (this.isOutOfMap()) {
            this.impact();
            return;
        }
        for (var i = 0; i < this.level.enemies.length; i++) {
            var e = this.level.enemies[i];
            if (!e.is_dead && e.z < this.w && Func_js_1.default.elipseCollision(this.getBoxElipse(), e.getBoxElipse())) {
                e.takeDamage(this.owner);
                this.impact();
                return;
            }
        }
        var traveled = Math.sqrt((Math.pow((this.x - this.start_x), 2)) + (Math.pow((this.y - this.start_y), 2)));
        if (traveled >= this.max_distance) {
            this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
            this.level.deleted.push(this.id);
            return;
        }
        else if (traveled > this.medium_distance && this.state === 1) {
            this.state = 2;
            this.move_speed = 0.8;
        }
        else if (traveled > this.min_distance && this.state === 0) {
            this.state = 1;
            this.move_speed = 0.7;
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
    Tooth.prototype.impact = function () {
        var _this = this;
        var e = new ToothExplode_js_1.default(this.level);
        e.setPoint(this.x, this.y);
        this.level.effects.push(e);
        this.level.deleted.push(this.id);
        this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
    };
    return Tooth;
}(Projectiles_js_1.default));
exports.Tooth = Tooth;
