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
var Unit_1 = require("./Unit");
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(socket_id, level) {
        var _this = _super.call(this, socket_id, level, 50, 50) || this;
        _this.pressed = {};
        _this.box_r = 2.5;
        _this.can_move_by_player = true;
        _this.knowledge = 0;
        _this.agility = 0;
        _this.speed = 0;
        _this.will = 0;
        _this.durability = 0;
        _this.spirit = 0;
        _this.armour_rate = 0;
        _this.hit_point = 1;
        _this.maximum_hit_point = 1;
        _this.getState();
        return _this;
    }
    Player.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            state: this.state,
            flipped: this.flipped,
            name: this.name,
            z: this.z,
            action: this.action
        };
    };
    Player.prototype.damagedAct = function () {
    };
    Player.prototype.setDamagedAct = function () {
        var _this = this;
        this.damaged = true;
        this.state = 'damaged';
        this.can_move_by_player = false;
        this.stateAct = this.damagedAct;
        setTimeout(function () {
            _this.can_move_by_player = true;
            _this.damaged = false;
            _this.getState();
        }, 300);
    };
    Player.prototype.takeDamage = function () {
        return;
        if (this.damaged)
            return;
        this.setDamagedAct();
    };
    Player.prototype.moveAct = function () {
        if (!this.can_move_by_player) {
            return;
        }
        if (!this.is_attacking) {
            if (!this.moveIsPressed()) {
                this.state = 'idle';
                return;
            }
            else {
                this.state = 'move';
            }
        }
        var next_step_x = 0;
        var next_step_y = 0;
        if (this.pressed['w']) {
            next_step_y = -1;
        }
        if (this.pressed['s']) {
            next_step_y = 1;
        }
        if (this.pressed['d']) {
            next_step_x = 1;
        }
        if (this.pressed['a']) {
            next_step_x = -1;
        }
        if (next_step_x != 0 && next_step_y != 0) {
            next_step_x *= 0.67;
            next_step_y *= 0.67;
        }
        if (next_step_x < 0 && !this.is_attacking) {
            this.flipped = true;
        }
        else if (!this.is_attacking) {
            this.flipped = false;
        }
        next_step_y *= 0.5;
        var speed = this.getMoveSpeed();
        next_step_x *= speed;
        next_step_y *= speed;
        var coll_e_x = undefined;
        var coll_e_y = undefined;
        var x_coll = false;
        var y_coll = false;
        for (var i = 0; i < this.level.enemies.length; i++) {
            var enemy = this.level.enemies[i];
            if (Func_1.default.elipseCollision(this.getBoxElipse(next_step_x, 0), enemy.getBoxElipse())) {
                x_coll = true;
                next_step_x = 0;
                coll_e_x = enemy;
                if (y_coll) {
                    break;
                }
            }
            if (Func_1.default.elipseCollision(this.getBoxElipse(0, next_step_y), enemy.getBoxElipse())) {
                y_coll = true;
                next_step_y = 0;
                coll_e_y = enemy;
                if (x_coll) {
                    break;
                }
            }
        }
        if (!this.level.isOutOfMap(this.x + next_step_x, this.y + next_step_y)) {
            if (x_coll && next_step_y === 0) {
                if (this.y <= coll_e_x.y) {
                    next_step_y = -0.2;
                }
                else {
                    next_step_y = 0.2;
                }
            }
            if (y_coll && next_step_x === 0) {
                if (this.x <= coll_e_y.x) {
                    next_step_x = -0.2;
                }
                else {
                    next_step_x = 0.2;
                }
            }
            this.addToPoint(next_step_x, next_step_y);
        }
    };
    Player.prototype.moveIsPressed = function () {
        return this.pressed['w'] || this.pressed['s'] || this.pressed['d'] || this.pressed['a'];
    };
    Player.prototype.idleAct = function () {
        var _a;
        if (this.pressed.l_click) {
            (_a = this.first_ab) === null || _a === void 0 ? void 0 : _a.use();
        }
        if (this.pressed.r_click) {
            this.useSecond();
        }
    };
    Player.prototype.act = function () {
        if (!this.stateAct)
            return;
        this.stateAct();
        this.moveAct();
    };
    Player.prototype.setIdleState = function () {
        this.state = 'idle';
        this.stateAct = this.idleAct;
    };
    Player.prototype.getState = function () {
        if (this.damaged) {
            return;
        }
        this.setIdleState();
    };
    Player.prototype.setLastInputs = function (pressed) {
        this.pressed = pressed;
    };
    return Player;
}(Unit_1.default));
exports.default = Player;
