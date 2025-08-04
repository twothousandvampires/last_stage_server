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
var Enemy_1 = require("../Enemy/Enemy");
var Pile = /** @class */ (function (_super) {
    __extends(Pile, _super);
    function Pile(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'pile';
        _this.box_r = 2;
        _this.move_speed = 0;
        _this.spawn_time = 1000;
        _this.last_cast_time = Date.now();
        _this.life_status = 4;
        _this.frequency = 2000;
        _this.duration = 10000;
        _this.created = Date.now();
        return _this;
    }
    Pile.prototype.setStun = function () {
        // immune
    };
    Pile.prototype.setZap = function () {
        // immune
    };
    Pile.prototype.setFreeze = function () {
        // immune
    };
    Pile.prototype.setDyingAct = function () {
        this.is_dead = true;
        this.state = 'dying';
        this.stateAct = this.DyingAct;
        this.setTimerToGetState(this.dying_time);
    };
    Pile.prototype.takeDamage = function (unit, options) {
        if (unit === void 0) { unit = undefined; }
        if (options === void 0) { options = {}; }
        if (this.is_dead)
            return;
        if (options === null || options === void 0 ? void 0 : options.instant_death) {
            unit === null || unit === void 0 ? void 0 : unit.succesefulKill();
            this.is_dead = true;
            this.setDyingAct();
            return;
        }
        this.life_status--;
        if ((unit === null || unit === void 0 ? void 0 : unit.critical) && Func_1.default.chance(unit.critical)) {
            this.life_status--;
        }
        if (this.life_status <= 0) {
            this.is_dead = true;
            this.create_grace_chance += (unit === null || unit === void 0 ? void 0 : unit.additional_chance_grace_create) ? unit === null || unit === void 0 ? void 0 : unit.additional_chance_grace_create : 0;
            unit === null || unit === void 0 ? void 0 : unit.succesefulKill();
            this.setDyingAct();
        }
        else {
            unit === null || unit === void 0 ? void 0 : unit.succesefulHit();
        }
    };
    Pile.prototype.setCastState = function () {
        var _this = this;
        this.state = 'cast';
        this.is_attacking = true;
        this.stateAct = this.castAct;
        this.action_time = 2000;
        this.cancelAct = function () {
            _this.action = false;
            _this.is_attacking = false;
            _this.hit = false;
        };
        this.setTimerToGetState(2000);
    };
    Pile.prototype.idleAct = function (time) {
        var last_cast = this.last_cast_time;
        if (time - this.created >= this.duration) {
            this.setDyingAct();
        }
        else if (time - last_cast >= this.frequency) {
            this.last_cast_time = time;
            this.setCastState();
        }
    };
    return Pile;
}(Enemy_1.Enemy));
exports.default = Pile;
