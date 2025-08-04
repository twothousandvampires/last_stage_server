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
var RuneExplode_js_1 = require("./RuneExplode.js");
var Rune = /** @class */ (function (_super) {
    __extends(Rune, _super);
    function Rune(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'rune';
        _this.time = Date.now();
        _this.box_r = 10;
        _this.fast_detonation = false;
        _this.explosive = false;
        _this.second_detanation = false;
        _this.already_exploded = false;
        return _this;
    }
    Rune.prototype.explode = function () {
        var _this = this;
        var e = new RuneExplode_js_1.default(this.level);
        e.setPoint(this.x, this.y);
        this.level.effects.push(e);
        var box = this.getBoxElipse();
        if (this.explosive) {
            box.r += 2;
        }
        this.level.enemies.forEach(function (elem) {
            if (Func_js_1.default.elipseCollision(box, elem.getBoxElipse())) {
                elem.takeDamage(_this.owner);
            }
        });
        this.level.players.forEach(function (elem) {
            if (Func_js_1.default.elipseCollision(box, elem.getBoxElipse())) {
                elem.takeDamage(_this.owner);
            }
        });
        if (this.second_detanation && Func_js_1.default.chance(50)) {
            setTimeout(function () {
                var e = new RuneExplode_js_1.default(_this.level);
                e.setPoint(_this.x, _this.y);
                _this.level.effects.push(e);
                var box = _this.getBoxElipse();
                box.r = 5;
                if (_this.explosive) {
                    box.r += 1;
                }
                _this.level.enemies.forEach(function (elem) {
                    if (Func_js_1.default.elipseCollision(box, elem.getBoxElipse())) {
                        elem.takeDamage(_this.owner);
                    }
                });
                _this.level.players.forEach(function (elem) {
                    if (Func_js_1.default.elipseCollision(box, elem.getBoxElipse())) {
                        elem.takeDamage(_this.owner);
                    }
                });
                _this.level.deleted.push(_this.id);
                _this.level.bindedEffects = _this.level.bindedEffects.filter(function (elem) { return elem != _this; });
            }, 1200);
        }
        else {
            this.level.deleted.push(this.id);
            this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem != _this; });
        }
    };
    Rune.prototype.act = function (time) {
        if (this.already_exploded)
            return;
        if (time - this.time >= (this.fast_detonation ? 2500 : 4000)) {
            this.explode();
            this.already_exploded = true;
        }
    };
    return Rune;
}(Effects_js_1.default));
exports.default = Rune;
