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
var Func_js_1 = require("../../Func.js");
var Effects_js_1 = require("./Effects.js");
var StaticFiled = /** @class */ (function (_super) {
    __extends(StaticFiled, _super);
    function StaticFiled(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'static field';
        _this.box_r = 8.5;
        _this.time = Date.now();
        _this.affected = new Map();
        _this.check_timer = 1000;
        _this.hand_cuffing = false;
        _this.collapse = false;
        return _this;
    }
    StaticFiled.prototype.act = function (time) {
        var _this = this;
        if (time - this.time >= 5000) {
            this.level.enemies.forEach(function (elem) {
                if (_this.affected.has(elem.id)) {
                    elem.move_speed = _this.affected.get(elem.id);
                    if (_this.hand_cuffing) {
                        elem.attack_speed -= 1000;
                    }
                    if (_this.collapse && Func_js_1.default.chance(5)) {
                        elem.takeDamage(undefined, {
                            instant_death: true
                        });
                    }
                }
            });
            this.level.players.forEach(function (elem) {
                if (_this.affected.has(elem.id)) {
                    elem.move_speed = _this.affected.get(elem.id);
                    if (_this.hand_cuffing) {
                        elem.attack_speed -= 1000;
                    }
                    if (_this.collapse && Func_js_1.default.chance(5)) {
                        elem.takeDamage(undefined, {
                            instant_death: true
                        });
                    }
                }
            });
            this.level.projectiles.forEach(function (elem) {
                if (_this.affected.has(elem.id)) {
                    elem.move_speed = _this.affected.get(elem.id);
                }
            });
            this.level.deleted.push(this.id);
            this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem != _this; });
            return;
        }
        if (!this.last_check || time - this.last_check >= this.check_timer) {
            this.last_check += this.check_timer;
            this.level.enemies.forEach(function (elem) {
                if (!_this.affected.has(elem.id) && Func_js_1.default.elipseCollision(_this.getBoxElipse(), elem.getBoxElipse())) {
                    _this.affected.set(elem.id, elem.move_speed);
                    elem.move_speed = 0;
                    if (_this.hand_cuffing) {
                        elem.attack_speed += 1000;
                    }
                }
            });
            this.level.players.forEach(function (elem) {
                if (!_this.affected.has(elem.id) && Func_js_1.default.elipseCollision(_this.getBoxElipse(), elem.getBoxElipse())) {
                    _this.affected.set(elem.id, elem.move_speed);
                    elem.move_speed = 0;
                    if (_this.hand_cuffing) {
                        elem.attack_speed += 1000;
                    }
                }
            });
            this.level.projectiles.forEach(function (elem) {
                if (!_this.affected.has(elem.id) && Func_js_1.default.elipseCollision(_this.getBoxElipse(), elem.getBoxElipse())) {
                    _this.affected.set(elem.id, elem.move_speed);
                    elem.move_speed = 0;
                }
            });
        }
    };
    return StaticFiled;
}(Effects_js_1.default));
exports.default = StaticFiled;
