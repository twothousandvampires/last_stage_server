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
var CommandsStatus_1 = require("../../Status/CommandsStatus");
var SwordmanAbility_1 = require("./SwordmanAbility");
var Commands = /** @class */ (function (_super) {
    __extends(Commands, _super);
    function Commands(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cd = false;
        _this.cast = false;
        _this.fast_commands = false;
        _this.name = 'commands';
        return _this;
    }
    Commands.prototype.canUse = function () {
        return !this.cd;
    };
    Commands.prototype.use = function () {
        var _this = this;
        if (this.cd)
            return;
        this.cd = true;
        setTimeout(function () {
            _this.cd = false;
            _this.cast = false;
        }, 20000);
        this.owner.state = 'cast';
        this.owner.can_move_by_player = false;
        this.owner.stateAct = this.getAct();
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.can_move_by_player = true;
            _this.owner.action_time = undefined;
            _this.cast = false;
        };
        this.owner.action_time = 1500;
        setTimeout(function () {
            _this.cast = true;
        }, 1500);
    };
    Commands.prototype.getAct = function () {
        var ability = this;
        var owner = this.owner;
        return function () {
            if (ability.cast) {
                ability.cast = false;
                this.level.sounds.push({
                    name: 'holy cast',
                    x: this.x,
                    y: this.y
                });
                var skill_elip_1 = owner.getBoxElipse();
                skill_elip_1.r = 25;
                var second = this.getSecondResource();
                var players = this.level.players.filter(function (elem) { return Func_1.default.elipseCollision(elem.getBoxElipse(), skill_elip_1); });
                var move_buff_1 = (5 + second) / 100;
                var armour_buff_1 = 5 + second;
                var duration_1 = 12000;
                if (ability.fast_commands) {
                    move_buff_1 = Math.round(move_buff_1 * 1.5);
                    armour_buff_1 = Math.round(armour_buff_1 * 1.5);
                    duration_1 = 6000;
                }
                players.forEach(function (elem) {
                    var status = new CommandsStatus_1.default(elem.time, duration_1, move_buff_1, armour_buff_1);
                    owner.level.setStatus(elem, status);
                });
                owner.getState();
            }
        };
    };
    return Commands;
}(SwordmanAbility_1.default));
exports.default = Commands;
