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
var Character_1 = require("../Objects/src/Character");
var CurseOfDamnedEffect_1 = require("../Objects/Effects/CurseOfDamnedEffect");
var Curse_1 = require("./Curse");
var CureseOfDamnedArea_1 = require("../Objects/Effects/CureseOfDamnedArea");
var Func_1 = require("../Func");
var Status_1 = require("./Status");
var CurseOfDamned = /** @class */ (function (_super) {
    __extends(CurseOfDamned, _super);
    function CurseOfDamned(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.need_to_check_resist = true;
        return _this;
    }
    CurseOfDamned.prototype.apply = function (unit) {
        this.unit = unit;
        this.effect = new CurseOfDamnedEffect_1.default(this.unit.level);
        this.effect.setOwner(this.unit);
        this.unit.statusWasApplied();
        this.unit.level.bindedEffects.push(this.effect);
    };
    CurseOfDamned.prototype.clear = function () {
        var _this = this;
        if (this.unit instanceof Character_1.default) {
            var ppl = this.unit.level.players.filter(function (elem) { return Func_1.default.distance(elem, _this.unit) <= 20; });
            ppl.forEach(function (elem) {
                var s = new Curse_1.default(elem.time, 5000);
                _this.unit.level.setStatus(elem, s);
            });
            var e = new CureseOfDamnedArea_1.default(this.unit.level);
            e.setPoint(this.unit.x, this.unit.y);
            this.unit.level.effects.push(e);
            this.unit.level.deleted.push(this.effect.id);
            this.unit.level.bindedEffects = this.unit.level.bindedEffects.filter(function (e) { return e != _this.effect; });
        }
    };
    return CurseOfDamned;
}(Status_1.default));
exports.default = CurseOfDamned;
