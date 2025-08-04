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
var ChargedSphere = /** @class */ (function (_super) {
    __extends(ChargedSphere, _super);
    function ChargedSphere(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'charged sphere';
        _this.x = undefined;
        _this.y = undefined;
        _this.box_r = 2;
        _this.time = Date.now();
        return _this;
    }
    ChargedSphere.prototype.act = function (time) {
        var _this = this;
        if (time - this.time >= 10000) {
            this.level.deleted.push(this.id);
            this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem != _this; });
            return;
        }
        this.level.players.forEach(function (elem) {
            if (Func_js_1.default.elipseCollision(elem.getBoxElipse(), _this.getBoxElipse())) {
                if (elem.can_regen_resource) {
                    elem.addResourse(2);
                }
                _this.level.deleted.push(_this.id);
                _this.level.bindedEffects = _this.level.bindedEffects.filter(function (elem) { return elem != _this; });
                elem.move_speed += 0.1;
                setTimeout(function () {
                    elem.move_speed -= 0.1;
                }, 5000);
            }
        });
    };
    return ChargedSphere;
}(Effects_js_1.default));
exports.default = ChargedSphere;
