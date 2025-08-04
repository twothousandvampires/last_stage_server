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
var Func_1 = require("../Func");
var BigShockNova_1 = require("../Objects/Effects/BigShockNova");
var Item_1 = require("./Item");
var SparklingHelmet = /** @class */ (function (_super) {
    __extends(SparklingHelmet, _super);
    function SparklingHelmet() {
        var _this = _super.call(this) || this;
        _this.power = 0;
        _this.time_beetween_proc = 7000;
        return _this;
    }
    SparklingHelmet.prototype.equip = function (character) {
        character.level.setStatus(character, this);
    };
    SparklingHelmet.prototype.unitDead = function () {
    };
    SparklingHelmet.prototype.canBeForged = function (character) {
        return this.power < 3;
    };
    SparklingHelmet.prototype.forge = function (character) {
        this.power++;
        this.time_beetween_proc -= 1000;
    };
    SparklingHelmet.prototype.apply = function (unit) {
        this.unit = unit;
        this.last_trigger_time = Date.now();
    };
    SparklingHelmet.prototype.clear = function () {
    };
    SparklingHelmet.prototype.update = function (status) {
    };
    SparklingHelmet.prototype.checkResist = function () {
        return false;
    };
    SparklingHelmet.prototype.isExpired = function () {
        return false;
    };
    SparklingHelmet.prototype.act = function (tick_time) {
        if (tick_time - this.unit.last_skill_used_time >= this.time_beetween_proc) {
            if (tick_time >= this.last_trigger_time) {
                this.trigger();
                this.last_trigger_time = tick_time + this.time_beetween_proc;
            }
        }
    };
    SparklingHelmet.prototype.trigger = function () {
        var _this = this;
        var e = new BigShockNova_1.default(this.unit.level);
        e.setOwner(this.unit);
        e.setPoint(this.unit.x, this.unit.y);
        this.unit.level.effects.push(e);
        var enemies = this.unit.level.enemies;
        var players = this.unit.level.players;
        var targets = enemies.concat(players);
        var wave = this.unit.getBoxElipse();
        wave.r = 20;
        this.unit.level.addSound('static', this.unit.x, this.unit.y);
        var was_sound = false;
        targets.forEach(function (elem) {
            if (!elem.is_dead && elem.z < 1 && Func_1.default.elipseCollision(wave, elem.getBoxElipse()) && elem != _this.unit) {
                var timer = Func_1.default.random(100, 2000);
                elem.setZap(timer);
                if (!was_sound) {
                    _this.unit.level.addSound('zap', elem.x, elem.y);
                    was_sound = true;
                }
            }
        });
    };
    return SparklingHelmet;
}(Item_1.default));
exports.default = SparklingHelmet;
