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
var SmallShockNova_1 = require("../../Objects/Effects/SmallShockNova");
var Lightning_1 = require("../../Objects/Projectiles/Lightning");
var FlyerAbility_1 = require("./FlyerAbility");
var LightBeacon = /** @class */ (function (_super) {
    __extends(LightBeacon, _super);
    function LightBeacon(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cost = 7;
        _this.state = 0;
        _this.up_timer;
        _this.beacon_timer;
        _this.name = 'light beacon';
        _this.lightning_waves = false;
        _this.air_form = false;
        return _this;
    }
    LightBeacon.prototype.canUse = function () {
        return this.owner.resource >= this.cost;
    };
    LightBeacon.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.owner.can_move_by_player = false;
        this.state = 0;
        this.owner.pay_to_cost = this.cost;
        this.owner.is_attacking = true;
        this.owner.state = 'fly up';
        this.owner.action_time = 800;
        this.owner.stateAct = this.act();
        var cast_speed = this.owner.getCastSpeed();
        this.owner.level.addSound('lightning cast', this.owner.x, this.owner.y);
        this.owner.action_time = cast_speed;
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.can_move_by_player = true;
            _this.owner.hit = false;
            _this.owner.is_attacking = false;
            _this.owner.z = 0;
            _this.owner.light_r -= 5;
            if (_this.air_form) {
                setTimeout(function () {
                    _this.owner.can_be_damaged = true;
                }, 3000);
            }
            else {
                _this.owner.can_be_damaged = true;
            }
        };
    };
    LightBeacon.prototype.act = function () {
        var _this = this;
        var ability = this;
        var timer = undefined;
        var owner = this.owner;
        return function () {
            if (ability.state === 0) {
                if (owner.action) {
                    owner.can_be_damaged = false;
                    owner.payCost();
                    owner.action = false;
                    ability.state = 1;
                    owner.state = 'light beacon';
                    owner.z += 2;
                    owner.light_r += 5;
                    var box_1 = owner.getBoxElipse();
                    box_1.r = 17;
                    if (_this.lightning_waves) {
                        var timer_freq = 600 - (owner.getAdditionalRadius() * 50);
                        if (timer_freq < 150) {
                            timer_freq = 150;
                        }
                        timer = setInterval(function () {
                            var e = new SmallShockNova_1.default(owner.level);
                            e.setPoint(owner.x, owner.y);
                            owner.level.effects.push(e);
                            owner.level.enemies.forEach(function (elem) {
                                if (Func_1.default.elipseCollision(elem.getBoxElipse(), box_1)) {
                                    elem.takeDamage();
                                }
                            });
                        }, timer_freq);
                    }
                    else {
                        var timer_freq = 150 - (owner.getAdditionalRadius() * 10);
                        if (timer_freq < 30) {
                            timer_freq = 30;
                        }
                        timer = setInterval(function () {
                            var e = new Lightning_1.Lightning(owner.level);
                            e.setOwner(owner);
                            e.setAngle(Math.random() * 6.28);
                            e.setPoint(owner.x, owner.y);
                            owner.level.projectiles.push(e);
                        }, timer_freq);
                    }
                    setTimeout(function () {
                        ability.state = 2;
                        owner.state = 'fly down';
                        owner.action_time = 800;
                        clearInterval(timer);
                    }, 6000);
                }
                else {
                    owner.z += 0.1;
                }
            }
            else if (ability.state === 1) {
            }
            else if (ability.state === 2) {
                owner.z -= 0.1;
                if (owner.action) {
                    ability.state = 0;
                    owner.action = false;
                    owner.z = 0;
                    owner.getState();
                }
            }
        };
    };
    return LightBeacon;
}(FlyerAbility_1.default));
exports.default = LightBeacon;
