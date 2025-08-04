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
exports.SoulShatterProj = void 0;
var Func_js_1 = require("../../Func.js");
var Projectiles_js_1 = require("./Projectiles.js");
var SoulShatterProj = /** @class */ (function (_super) {
    __extends(SoulShatterProj, _super);
    function SoulShatterProj(level) {
        var _this = _super.call(this, level) || this;
        _this.box_r = 0.4;
        _this.name = 'specter soul seeker';
        _this.move_speed = 0.4;
        _this.w = 3;
        _this.duration = 10000;
        return _this;
    }
    SoulShatterProj.prototype.setStart = function (time) {
        this.start = time;
        this.change_angle = time;
    };
    SoulShatterProj.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
    };
    SoulShatterProj.prototype.act = function (tick) {
        var _this = this;
        if (tick - this.start >= this.duration) {
            this.delete();
            return;
        }
        if (tick - this.change_angle >= 500) {
            this.change_angle += 500;
            if (Math.random() > 0.5) {
                this.angle += 0.5;
            }
            else {
                this.angle -= 0.5;
            }
        }
        this.level.players.forEach(function (elem) {
        });
        this.level.enemies.forEach(function (elem) {
            if (!elem.is_dead && Func_js_1.default.elipseCollision(elem.getBoxElipse(), _this.getBoxElipse())) {
                elem.takeDamage();
                _this.delete();
            }
        });
        var l = 1 - Math.abs(0.5 * Math.cos(this.angle));
        var n_x = Math.sin(this.angle) * l;
        var n_y = Math.cos(this.angle) * l;
        n_x *= this.move_speed;
        n_y *= this.move_speed;
        if (this.isOutOfMap(this.x + n_x, this.y + n_y)) {
            this.reflect(this.isOutOfMap(this.x + n_x, this.y) ? 90 : 0);
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
    SoulShatterProj.prototype.delete = function () {
        var _this = this;
        this.level.deleted.push(this.id);
        this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
    };
    SoulShatterProj.prototype.reflect = function (angle) {
        var normalAngle = angle + Math.PI / 2;
        var incidenceAngle = this.angle - normalAngle;
        var reflectedAngle = normalAngle - incidenceAngle;
        this.angle = (reflectedAngle + 2 * Math.PI) % (2 * Math.PI);
    };
    return SoulShatterProj;
}(Projectiles_js_1.default));
exports.SoulShatterProj = SoulShatterProj;
