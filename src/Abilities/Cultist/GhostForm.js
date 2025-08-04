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
var Func_1 = require("../../Func");
var AfterlifeCold_1 = require("../../Status/AfterlifeCold");
var Weakness_1 = require("../../Status/Weakness");
var CultistAbility_1 = require("./CultistAbility");
var GhostForm = /** @class */ (function (_super) {
    __extends(GhostForm, _super);
    function GhostForm(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cd = false;
        _this.lead = false;
        _this.afterlife_cold = false;
        _this.name = 'ghost form';
        return _this;
    }
    GhostForm.prototype.canUse = function () {
        return !this.cd;
    };
    GhostForm.prototype.use = function () {
        var _this = this;
        if (this.cd)
            return;
        this.cd = true;
        setTimeout(function () {
            _this.cd = false;
        }, 20000);
        this.owner.action_time = 500;
        this.owner.can_be_damaged = false;
        this.owner.phasing = true;
        this.owner.can_attack = false;
        this.owner.can_cast = false;
        this.owner.state = 'start ghost';
        setTimeout(function () {
            _this.owner.state = 'ghost';
            var ghost_time = 3000 + _this.owner.getSecondResource() * 250;
            _this.owner.setTimerToGetState(ghost_time);
            if (_this.afterlife_cold) {
                var status_1 = new AfterlifeCold_1.default(_this.owner.time, ghost_time);
                _this.owner.level.setStatus(_this.owner, status_1);
            }
            if (_this.lead) {
                var r_1 = _this.owner.getBoxElipse();
                r_1.r = 15;
                _this.owner.level.players.forEach(function (elem) {
                    if (elem != _this.owner && Func_1.default.elipseCollision(elem.getBoxElipse(), r_1)) {
                        elem.phasing = true;
                        var status_2 = new Weakness_1.default(_this.owner.time, ghost_time);
                        _this.owner.level.setStatus(elem, status_2);
                        setTimeout(function () {
                            elem.phasing = false;
                        }, ghost_time);
                    }
                });
            }
        }, 500);
        this.owner.cancelAct = function () {
            _this.owner.can_be_damaged = true;
            _this.owner.phasing = false;
            _this.owner.can_attack = true;
            _this.owner.can_cast = true;
        };
    };
    return GhostForm;
}(CultistAbility_1.default));
exports.default = GhostForm;
