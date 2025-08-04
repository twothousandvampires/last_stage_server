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
var FlyerAbility_1 = require("./FlyerAbility");
var Teleportation = /** @class */ (function (_super) {
    __extends(Teleportation, _super);
    function Teleportation(owner) {
        var _this = _super.call(this, owner) || this;
        _this.state = 0;
        _this.cd = false;
        _this.name = 'teleportaion';
        _this.protected = false;
        _this.increased_gate = false;
        return _this;
    }
    Teleportation.prototype.canUse = function () {
        return !this.cd;
    };
    Teleportation.prototype.use = function () {
        var _this = this;
        if (this.cd)
            return;
        if (!this.owner.pressed.over_x || !this.owner.pressed.over_y)
            return;
        this.teleport_x = Math.round(this.owner.pressed.over_x + this.owner.x - 40);
        this.teleport_y = Math.round(this.owner.pressed.over_y + this.owner.y - 40);
        if (this.owner.isOutOfMap(this.teleport_x, this.teleport_x)) {
            this.teleport_x = undefined;
            this.teleport_y = undefined;
            return;
        }
        this.cd = true;
        setTimeout(function () {
            _this.cd = false;
        }, 20000 - this.owner.getSecondResource() * 1000);
        this.owner.can_move_by_player = false;
        this.owner.state = 'teleport start';
        this.owner.level.addSound('cast', this.owner.x, this.owner.y);
        this.owner.stateAct = this.act();
        if (this.protected) {
            this.owner.can_be_damaged = false;
        }
        this.owner.action_time = this.owner.getCastSpeed();
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.can_move_by_player = true;
            _this.teleport_x = undefined;
            _this.teleport_y = undefined;
            _this.state = 0;
            _this.owner.can_be_damaged = true;
        };
    };
    Teleportation.prototype.act = function () {
        var _this = this;
        var ability = this;
        var owner = this.owner;
        return function () {
            if (_this.owner.action) {
                _this.owner.action = false;
                if (ability.state === 0) {
                    owner.x = 666;
                    owner.y = 666;
                    owner.can_be_damaged = false;
                    setTimeout(function () {
                        owner.x = ability.teleport_x;
                        owner.y = ability.teleport_y;
                        owner.state = 'teleport end';
                        ability.state = 1;
                    }, 500);
                }
                else {
                    var box_1 = owner.getBoxElipse();
                    if (ability.increased_gate) {
                        box_1.r += 3;
                    }
                    owner.can_be_damaged = true;
                    owner.level.enemies.forEach(function (e) {
                        if (!e.is_dead && Func_1.default.elipseCollision(box_1, e.getBoxElipse())) {
                            e.takeDamage(owner, {
                                explode: true
                            });
                        }
                    });
                    owner.level.players.forEach(function (p) {
                        if (p != owner && !p.is_dead && Func_1.default.elipseCollision(box_1, p.getBoxElipse())) {
                            p.takeDamage(owner, {
                                explode: true
                            });
                        }
                    });
                    ability.state = 0;
                    ability.teleport_x = undefined;
                    ability.teleport_y = undefined;
                    owner.getState();
                }
            }
        };
    };
    return Teleportation;
}(FlyerAbility_1.default));
exports.default = Teleportation;
