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
var ImprovedSwingTechnology_1 = require("../../Status/ImprovedSwingTechnology");
var SwordmanAbility_1 = require("./SwordmanAbility");
var WeaponSwing = /** @class */ (function (_super) {
    __extends(WeaponSwing, _super);
    function WeaponSwing(owner) {
        var _this = _super.call(this, owner) || this;
        _this.echo_swing = false;
        _this.improved_swing_technology = false;
        _this.name = 'swing';
        return _this;
    }
    WeaponSwing.prototype.canUse = function () {
        return true;
    };
    WeaponSwing.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        var rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40);
        var rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40);
        if (rel_x < this.owner.x) {
            this.owner.flipped = true;
        }
        else {
            this.owner.flipped = false;
        }
        this.owner.attack_angle = Func_1.default.angle(this.owner.x, this.owner.y, rel_x, rel_y);
        this.owner.is_attacking = true;
        this.owner.state = 'attack';
        var attack_move_speed_penalty = this.owner.getAttackMoveSpeedPenalty();
        this.owner.addMoveSpeedPenalty(-attack_move_speed_penalty);
        this.owner.stateAct = this.act;
        var attack_speed = this.owner.getAttackSpeed();
        this.owner.action_time = attack_speed;
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.addMoveSpeedPenalty(attack_move_speed_penalty);
            setTimeout(function () {
                _this.owner.hit = false;
                _this.owner.is_attacking = false;
            }, 50);
        };
        this.owner.setTimerToGetState(attack_speed);
    };
    WeaponSwing.prototype.act = function () {
        var _this = this;
        var _a, _b;
        if (this.action && !this.hit) {
            this.hit = true;
            var enemies_1 = this.level.enemies;
            var players = this.level.players;
            var attack_elipse_1 = this.getBoxElipse();
            attack_elipse_1.r = this.attack_radius + Math.round(this.might / 2);
            var attack_angle_1 = this.attack_angle;
            var f = enemies_1.filter(function (elem) { return Func_1.default.checkAngle(_this, elem, _this.attack_angle, _this.weapon_angle + _this.agility / 10); });
            var filtered_by_attack_radius = f.filter(function (elem) { return Func_1.default.elipseCollision(attack_elipse_1, elem.getBoxElipse()); });
            filtered_by_attack_radius.sort(function (a, b) { return Func_1.default.distance(a, _this) - Func_1.default.distance(b, _this); });
            var target = undefined;
            if (this.target) {
                target = enemies_1.find(function (elem) { return elem.id === _this.target; });
                if (!target) {
                    target = players.find(function (elem) { return elem.id === _this.target; });
                }
                if (target) {
                    if (!Func_1.default.checkAngle(this, target, this.attack_angle, 3.14)) {
                        target = undefined;
                    }
                    if (!target || !Func_1.default.elipseCollision(attack_elipse_1, target.getBoxElipse())) {
                        target = undefined;
                    }
                }
            }
            var hit_count = this.getTargetsCount();
            var point_added_1 = false;
            if (target) {
                filtered_by_attack_radius.unshift(target);
            }
            this.target = undefined;
            filtered_by_attack_radius = filtered_by_attack_radius.slice(0, hit_count);
            filtered_by_attack_radius.forEach(function (elem) {
                elem.takeDamage(_this);
                if (!point_added_1) {
                    _this.level.addSoundObject(elem.getWeaponHitedSound());
                    _this.succesefulHit();
                    _this.addPoint();
                    point_added_1 = true;
                }
            });
            if (!point_added_1) {
                this.level.sounds.push({
                    name: 'sword swing',
                    x: this.x,
                    y: this.y
                });
            }
            else {
                if (((_a = this.first_ab) === null || _a === void 0 ? void 0 : _a.improved_swing_technology) && Func_1.default.chance(30)) {
                    var status_1 = new ImprovedSwingTechnology_1.default(this.time, 5000);
                    this.level.setStatus(this, status_1, true);
                }
            }
            if (((_b = this.first_ab) === null || _b === void 0 ? void 0 : _b.echo_swing) && Func_1.default.chance(30)) {
                setTimeout(function () {
                    var _a;
                    attack_elipse_1.r += 1;
                    var f = enemies_1.filter(function (elem) { return Func_1.default.checkAngle(_this, elem, attack_angle_1, _this.weapon_angle + _this.might / 10); });
                    var filtered_by_attack_radius = f.filter(function (elem) { return Func_1.default.elipseCollision(attack_elipse_1, elem.getBoxElipse()); });
                    filtered_by_attack_radius.sort(function (a, b) { return Func_1.default.distance(a, _this) - Func_1.default.distance(b, _this); });
                    filtered_by_attack_radius.forEach(function (elem) {
                        elem.takeDamage(_this);
                    });
                    if (((_a = _this.first_ab) === null || _a === void 0 ? void 0 : _a.improved_swing_technology) && Func_1.default.chance(30) && filtered_by_attack_radius.length) {
                        var status_2 = new ImprovedSwingTechnology_1.default(_this.time, 5000);
                        _this.level.setStatus(_this, status_2, true);
                    }
                    _this.level.sounds.push({
                        name: 'sword swing',
                        x: _this.x,
                        y: _this.y
                    });
                }, 500);
            }
        }
    };
    return WeaponSwing;
}(SwordmanAbility_1.default));
exports.default = WeaponSwing;
