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
var Func_1 = require("../../../Func");
var GraceShard_1 = require("../../Effects/GraceShard");
var RuneExplode_1 = require("../../Effects/RuneExplode");
var Pile_1 = require("../Piles/Pile");
var Gifter = /** @class */ (function (_super) {
    __extends(Gifter, _super);
    function Gifter(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'gifter';
        _this.box_r = 2.4;
        _this.move_speed = 0;
        _this.attack_radius = 0;
        _this.attack_speed = 1600;
        _this.life_status = 10;
        _this.spawn_time = 1600;
        _this.armour_rate = 0;
        _this.create_chance = 0;
        _this.getState();
        return _this;
    }
    Gifter.prototype.getState = function () {
        this.start_time = Date.now();
        this.setState(this.setIdleAct);
    };
    Gifter.prototype.idleAct = function (tick) {
        if (tick - this.start_time >= 20000) {
            var hit_1 = this.getBoxElipse();
            hit_1.r = 10;
            this.level.players.forEach(function (elem) {
                if (Func_1.default.elipseCollision(elem.getBoxElipse(), hit_1)) {
                    elem.takeDamage();
                }
            });
            var e = new RuneExplode_1.default(this.level);
            e.setPoint(this.x, this.y);
            this.level.effects.push(e);
            this.is_dead = true;
            this.is_corpse = true;
            this.state = 'dead';
        }
    };
    Gifter.prototype.takeDamage = function (unit, options) {
        if (unit === void 0) { unit = undefined; }
        if (options === void 0) { options = {}; }
        if (this.is_dead)
            return;
        this.life_status--;
        if (options === null || options === void 0 ? void 0 : options.damage_value) {
            this.life_status -= options.damage_value;
        }
        else {
            this.life_status--;
        }
        if ((unit === null || unit === void 0 ? void 0 : unit.critical) && Func_1.default.chance(unit.critical)) {
            this.life_status--;
        }
        if (this.life_status <= 0) {
            this.is_dead = true;
            unit === null || unit === void 0 ? void 0 : unit.succesefulKill();
            this.setDyingAct();
        }
        else {
            unit === null || unit === void 0 ? void 0 : unit.succesefulHit();
        }
    };
    Gifter.prototype.setDyingAct = function () {
        for (var i = 0; i < 10; i++) {
            var add = Math.round(i / 3);
            var distance_x = Func_1.default.random(1, 3) + add;
            var distance_y = Func_1.default.random(1, 3) + add;
            var angle = Math.random() * 6.28;
            var x = this.x + (Math.sin(angle) * distance_x);
            var y = this.y + (Math.cos(angle) * distance_y);
            var grace = new GraceShard_1.default(this.level);
            grace.setPoint(x, y);
            this.level.bindedEffects.push(grace);
        }
        this.is_corpse = true;
        this.state = 'dead';
    };
    return Gifter;
}(Pile_1.default));
exports.default = Gifter;
