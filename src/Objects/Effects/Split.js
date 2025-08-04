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
var Split = /** @class */ (function (_super) {
    __extends(Split, _super);
    function Split(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'split';
        _this.box_r = 2;
        _this.time = Date.now();
        return _this;
    }
    Split.prototype.act = function (time) {
        var _this = this;
        if (time - this.time >= 10000) {
            this.level.deleted.push(this.id);
            this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem != _this; });
            return;
        }
        this.level.players.forEach(function (elem) {
            if (Func_js_1.default.elipseCollision(elem.getBoxElipse(), _this.getBoxElipse())) {
                elem.light_r += 2;
                elem.addLife();
                setTimeout(function () {
                    elem.light_r -= 2;
                }, 10000);
                var e_1 = _this.level.statusPull.filter(function (s) { return s.unit === elem; });
                if (e_1[0]) {
                    e_1[0].clear();
                    _this.level.statusPull = _this.level.statusPull.filter(function (s) { return s != e_1[0]; });
                }
                _this.level.deleted.push(_this.id);
                _this.level.bindedEffects = _this.level.bindedEffects.filter(function (elem) { return elem != _this; });
            }
        });
    };
    return Split;
}(Effects_js_1.default));
exports.default = Split;
