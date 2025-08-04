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
var GhostGrip_1 = require("../Objects/Effects/GhostGrip");
var Status_1 = require("./Status");
var GhostGrip = /** @class */ (function (_super) {
    __extends(GhostGrip, _super);
    function GhostGrip(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.name = 'ghost grip';
        _this.need_to_check_resist = true;
        return _this;
    }
    GhostGrip.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.addMoveSpeedPenalty(-50);
            this.unit.statusWasApplied();
            this.effect = new GhostGrip_1.default(this.unit.level);
            this.effect.setOwner(this.unit);
            this.unit.level.bindedEffects.push(this.effect);
            this.unit.newStatus({
                name: 'ghost grip',
                duration: this.duration,
                desc: 'movement is highed reduced'
            });
        }
    };
    GhostGrip.prototype.clear = function () {
        var _this = this;
        if (this.unit instanceof Character_1.default) {
            this.unit.addMoveSpeedPenalty(50);
            this.unit.level.deleted.push(this.effect.id);
            this.unit.level.bindedEffects = this.unit.level.bindedEffects.filter(function (e) { return e != _this.effect; });
        }
    };
    GhostGrip.prototype.update = function (status) {
        this.time = Date.now();
        this.unit.newStatus({
            name: 'ghost grip',
            duration: this.duration,
            desc: 'movement is highed reduced'
        });
    };
    return GhostGrip;
}(Status_1.default));
exports.default = GhostGrip;
