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
var Weakness_js_1 = require("../../Status/Weakness.js");
var Effects_js_1 = require("./Effects.js");
var SpecterVortex = /** @class */ (function (_super) {
    __extends(SpecterVortex, _super);
    function SpecterVortex(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'specter vortex';
        _this.x = undefined;
        _this.y = undefined;
        _this.timer = 1000;
        _this.last_check_time = Date.now() + 1000;
        _this.box_r = 25;
        _this.start = Date.now();
        return _this;
    }
    SpecterVortex.prototype.act = function (game_tick) {
        var _this = this;
        if (!this.owner || game_tick - this.start >= 5000) {
            this.level.deleted.push(this.id);
            this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem != _this; });
            return;
        }
        if (game_tick - this.last_check_time >= this.timer) {
            this.last_check_time += this.timer;
            this.level.players.forEach(function (elem) {
                if (Func_js_1.default.elipseCollision(_this.getBoxElipse(), elem.getBoxElipse())) {
                    var status_1 = new Weakness_js_1.default(game_tick, 1000);
                    _this.level.setStatus(elem, status_1, true);
                }
            });
        }
        this.x = this.owner.x;
        this.y = this.owner.y;
    };
    SpecterVortex.prototype.setOwner = function (character) {
        this.owner = character;
    };
    return SpecterVortex;
}(Effects_js_1.default));
exports.default = SpecterVortex;
