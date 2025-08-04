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
var Builder_1 = require("../../Classes/Builder");
var Func_1 = require("../../Func");
var WithColdStatus_1 = require("../../Status/WithColdStatus");
var WithFireStatus_1 = require("../../Status/WithFireStatus");
var WithStormStatus_1 = require("../../Status/WithStormStatus");
var Unit_1 = require("./Unit");
var Character = /** @class */ (function (_super) {
    __extends(Character, _super);
    function Character(level) {
        var _this = _super.call(this, level) || this;
        _this.pay_to_cost = 0;
        _this.pressed = {};
        _this.box_r = 2.5;
        _this.can_move_by_player = true;
        _this.resource = 0;
        _this.max_resource = 7;
        _this.knowledge = 0;
        _this.agility = 0;
        _this.speed = 0;
        _this.will = 0;
        _this.durability = 0;
        _this.might = 0;
        _this.can_be_damaged = true;
        _this.c_x = 0;
        _this.c_y = 0;
        _this.exploded = false;
        _this.a = 0.2;
        _this.can_be_lethaled = true;
        _this.base_regen_time = 10000;
        _this.grace = 0;
        _this.mastery = 0;
        _this.avoid_damaged_state_chance = 0;
        _this.onKillTriggers = [];
        _this.onHitTriggers = [];
        _this.useNotUtilityTriggers = [];
        _this.reachNearDeadTriggers = [];
        _this.playerDeadTriggers = [];
        _this.playerTakeLethalDamageTriggers = [];
        _this.whenHitedTriggers = [];
        _this.can_regen_resource = true;
        _this.can_regen_life = true;
        _this.light_r = 16;
        _this.can_use_skills = true;
        _this.upgrades = [];
        _this.can_generate_upgrades = true;
        _this.time_stopped = false;
        _this.additional_chance_grace_create = 0;
        _this.blessed = false;
        _this.pierce = 0;
        _this.critical = 0;
        _this.status_resistance = 5;
        _this.can_attack = true;
        _this.can_cast = true;
        _this.getState();
        return _this;
    }
    Character.prototype.isStatusResist = function () {
        return Func_1.default.chance(this.status_resistance);
    };
    Character.prototype.createItem = function (item_name) {
        this.item = Builder_1.default.createItem(item_name);
    };
    Character.prototype.payCost = function () {
        this.resource -= this.pay_to_cost;
        this.pay_to_cost = 0;
    };
    Character.prototype.statusWasApplied = function () {
    };
    Character.prototype.getMoveSpeedReduceWhenUseSkill = function () {
        return 70;
    };
    Character.prototype.getAllUpgrades = function () {
        return [
            {
                name: 'with storm',
                canUse: function (character) {
                    return true;
                },
                teach: function (character) {
                    var status = new WithStormStatus_1.default(character.time, 10000, 0);
                    character.level.setStatus(character, status, true);
                },
                cost: 2,
                desc: 'with strom'
            },
            {
                name: 'with fire',
                canUse: function (character) {
                    return true;
                },
                teach: function (character) {
                    var status = new WithFireStatus_1.default(character.time, 10000, 0);
                    character.level.setStatus(character, status, true);
                },
                cost: 2,
                desc: 'with fire'
            },
            {
                name: 'with cold',
                canUse: function (character) {
                    return true;
                },
                teach: function (character) {
                    var status = new WithColdStatus_1.default(character.time, 10000, 0);
                    character.level.setStatus(character, status, true);
                },
                cost: 2,
                desc: 'with cold'
            },
            {
                name: 'increase agility',
                canUse: function (character) {
                    return character.agility != undefined;
                },
                teach: function (character) {
                    character.agility++;
                },
                cost: 1,
                desc: 'increases your agility'
            },
            {
                name: 'increase knowledge',
                canUse: function (character) {
                    return character.knowledge != undefined;
                },
                teach: function (character) {
                    character.knowledge++;
                },
                cost: 1,
                desc: 'increases your knowledge'
            },
            {
                name: 'increase power',
                canUse: function (character) {
                    return character.might != undefined;
                },
                teach: function (character) {
                    character.might++;
                },
                cost: 1,
                desc: 'increases your might'
            },
            {
                name: 'increase durability',
                canUse: function (character) {
                    return character.durability != undefined;
                },
                teach: function (character) {
                    character.durability++;
                },
                cost: 1,
                desc: 'increases your durability'
            },
            {
                name: 'increase will',
                canUse: function (character) {
                    return character.will != undefined;
                },
                teach: function (character) {
                    character.will++;
                },
                cost: 1,
                desc: 'increases your will'
            },
            {
                name: 'increase speed',
                canUse: function (character) {
                    return character.speed != undefined;
                },
                teach: function (character) {
                    character.speed++;
                },
                cost: 1,
                desc: 'increases your speed'
            },
            {
                name: 'heal',
                canUse: function (character) {
                    return character.life_status < 3;
                },
                teach: function (character) {
                    character.addLife(3, true);
                },
                cost: 1,
                desc: 'give a life'
            },
            {
                name: 'forge',
                canUse: function (character) {
                    var _a;
                    return (_a = character.item) === null || _a === void 0 ? void 0 : _a.canBeForged(character);
                },
                teach: function (character) {
                    var _a;
                    (_a = character.item) === null || _a === void 0 ? void 0 : _a.forge(character);
                },
                cost: 1,
                desc: 'forge your equip'
            },
            {
                name: 'chosen one',
                canUse: function (character) {
                    return character.additional_chance_grace_create < 50;
                },
                teach: function (character) {
                    character.additional_chance_grace_create += 5;
                },
                cost: 1,
                desc: 'increases your chance to get grace after enemy dead'
            },
            {
                name: 'blessed',
                canUse: function (character) {
                    return !character.blessed;
                },
                teach: function (character) {
                    character.blessed = true;
                },
                cost: 1,
                desc: 'bones killed by your hit have reduced chance to ressurect'
            },
            {
                name: 'pressure',
                canUse: function (character) {
                    return character.pierce < 100;
                },
                teach: function (character) {
                    character.pierce += 15;
                },
                cost: 1,
                desc: 'give a chance to ignore armour'
            },
            {
                name: 'true hit',
                canUse: function (character) {
                    return character.critical < 100;
                },
                teach: function (character) {
                    character.critical += 15;
                },
                cost: 1,
                desc: 'give a chance to deal double damage'
            },
            {
                name: 'armour',
                canUse: function (character) {
                    return character.armour_rate < 95;
                },
                teach: function (character) {
                    character.armour_rate += 3;
                },
                cost: 1,
                desc: 'adds armour rate'
            },
            {
                name: 'gamble',
                canUse: function (character) {
                    return character.grace > 1;
                },
                teach: function (character) {
                    if (Func_1.default.chance(50)) {
                        character.grace *= 2;
                    }
                    else {
                        character.grace = Math.floor(character.grace / 2);
                    }
                },
                cost: 1,
                desc: 'lose or get grace'
            },
        ];
    };
    Character.prototype.takePureDamage = function () {
        this.subLife();
    };
    Character.prototype.removeUpgrades = function () {
        this.upgrades.length = 0;
    };
    Character.prototype.upgrade = function (upgrade_name) {
        var up = this.upgrades.find(function (elem) { return elem.name === upgrade_name; });
        up.teach(this);
        this.grace -= up.cost;
        this.removeUpgrades();
        this.closeUpgrades();
    };
    Character.prototype.showUpgrades = function () {
        this.level.socket.to(this.id).emit('show_upgrades', {
            upgrades: this.upgrades,
            grace: this.grace
        });
    };
    Character.prototype.updateClientSkill = function () {
        var _a, _b, _c, _d;
        var data = [{
                type: 'first',
                name: (_a = this === null || this === void 0 ? void 0 : this.first_ab) === null || _a === void 0 ? void 0 : _a.name
            },
            {
                type: 'secondary',
                name: (_b = this === null || this === void 0 ? void 0 : this.second_ab) === null || _b === void 0 ? void 0 : _b.name
            },
            {
                type: 'finisher',
                name: (_c = this === null || this === void 0 ? void 0 : this.third_ab) === null || _c === void 0 ? void 0 : _c.name
            },
            {
                type: 'utility',
                name: (_d = this === null || this === void 0 ? void 0 : this.utility) === null || _d === void 0 ? void 0 : _d.name
            }
        ];
        this.level.socket.to(this.id).emit('update_skill', data);
    };
    Character.prototype.holdGrace = function () {
        this.grace += 2;
        this.can_generate_upgrades = false;
        this.upgrades = [];
    };
    Character.prototype.closeUpgrades = function () {
        this.level.socket.to(this.id).emit('close_upgrades');
    };
    Character.prototype.setZone = function (zone_id, x, y) {
        this.zone_id = zone_id;
        this.x = x;
        this.y = y;
        this.level.socket.to(this.id).emit('change_level', this.zone_id);
    };
    Character.prototype.addLife = function (count, ignore_poison) {
        if (count === void 0) { count = 1; }
        if (ignore_poison === void 0) { ignore_poison = false; }
        if (!this.can_regen_life && !ignore_poison)
            return;
        for (var i = 0; i < count; i++) {
            var previous = this.life_status;
            if (previous >= 3) {
                return;
            }
            this.life_status++;
            if (previous === 1) {
                this.addMoveSpeedPenalty(30);
            }
            if (previous === 2) {
                this.addMoveSpeedPenalty(10);
            }
        }
    };
    Character.prototype.getWeaponHitedSound = function () {
        return {
            name: 'sword hit',
            x: this.x,
            y: this.y
        };
    };
    Character.prototype.subLife = function (unit, options) {
        if (unit === void 0) { unit = undefined; }
        if (options === void 0) { options = {}; }
        this.life_status--;
        if (this.life_status <= 0) {
            this.playerTakeLethalDamage();
            if (this.can_be_lethaled) {
                if (options === null || options === void 0 ? void 0 : options.explode) {
                    this.exploded = true;
                }
                unit === null || unit === void 0 ? void 0 : unit.succesefulKill();
                this.is_dead = true;
                this.setState(this.setDyingState);
                this.level.playerDead();
            }
            else {
                this.life_status++;
                this.can_be_lethaled = true;
            }
        }
        else {
            if (!Func_1.default.chance(this.getSkipDamageStateChance())) {
                this.setState(this.setDamagedAct);
            }
            if (this.life_status === 2) {
                this.addMoveSpeedPenalty(-10);
            }
            else if (this.life_status === 1) {
                this.addMoveSpeedPenalty(-30);
                this.reachNearDead();
            }
        }
    };
    Character.prototype.playerWasHited = function () {
        var _this = this;
        this.whenHitedTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
    };
    Character.prototype.playerTakeLethalDamage = function () {
        var _this = this;
        this.playerTakeLethalDamageTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
    };
    Character.prototype.playerDead = function () {
        var _this = this;
        this.playerDeadTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
    };
    Character.prototype.reachNearDead = function () {
        var _this = this;
        this.reachNearDeadTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
    };
    Character.prototype.succesefulKill = function () {
        var _this = this;
        this.onKillTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
    };
    Character.prototype.succesefulHit = function () {
        var _this = this;
        this.onHitTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
    };
    Character.prototype.applyStats = function (stats) {
        for (var stat in stats) {
            this[stat] = stats[stat];
        }
    };
    Character.prototype.damagedAct = function () {
    };
    Character.prototype.dyingAct = function () {
    };
    Character.prototype.setDyingState = function () {
        this.can_move_by_player = false;
        if (this.freezed) {
            this.state = 'freezed_dying';
            this.level.sounds.push({
                name: 'shatter',
                x: this.x,
                y: this.y
            });
        }
        else if (this.exploded) {
            this.state = 'explode';
        }
        else {
            this.state = 'dying';
            this.setTimerToGetState(1500);
        }
        this.stateAct = this.dyingAct;
    };
    Character.prototype.setDeadState = function () {
        this.state = 'dead';
        this.stateAct = this.deadAct;
    };
    Character.prototype.deadAct = function () {
    };
    Character.prototype.setDamagedAct = function () {
        var _this = this;
        this.damaged = true;
        this.state = 'damaged';
        this.can_move_by_player = false;
        this.stateAct = this.damagedAct;
        this.cancelAct = function () {
            _this.can_move_by_player = true;
            _this.damaged = false;
        };
        this.setTimerToGetState(300);
    };
    Character.prototype.takeDamage = function (unut, options) {
        if (unut === void 0) { unut = undefined; }
        if (options === void 0) { options = {}; }
        if (this.damaged)
            return;
        this.setState(this.setDamagedAct);
    };
    Character.prototype.setTarget = function (id) {
        if (!this.target) {
            this.target = id;
        }
    };
    Character.prototype.reaA = function () {
        if (this.a <= 0.2)
            return;
        this.a -= 0.03;
    };
    Character.prototype.incA = function () {
        if (this.a >= 1) {
            return;
        }
        this.a += 0.03;
    };
    Character.prototype.getTarget = function () {
        var _this = this;
        if (!this.target)
            return undefined;
        var t = this.level.enemies.find(function (elem) { return elem.id === _this.target; });
        if (!t) {
            t = this.level.players.find(function (elem) { return elem.id === _this.target && elem.id != _this.id; });
        }
        if (t) {
            return t;
        }
        return undefined;
    };
    Character.prototype.canMove = function () {
        return this.can_move_by_player && !this.freezed && !this.zaped;
    };
    Character.prototype.moveAct = function () {
        if (this.moveIsPressed() && this.canMove()) {
            this.is_moving = true;
            if (this.state === 'idle') {
                this.state = 'move';
            }
        }
        else if (!this.moveIsPressed() || !this.canMove()) {
            this.reaA();
            this.is_moving = false;
            if (this.state === 'move') {
                this.state = 'idle';
            }
            return;
        }
        this.incA();
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
        else if (!this.is_attacking && next_step_x > 0) {
            this.flipped = false;
        }
        next_step_y *= 0.5;
        var speed = this.getMoveSpeed();
        next_step_x *= speed;
        next_step_y *= speed;
        next_step_x *= this.a;
        next_step_y *= this.a;
        var coll_e_x = undefined;
        var coll_e_y = undefined;
        var x_coll = false;
        var y_coll = false;
        if (!this.phasing) {
            for (var i = 0; i < this.level.enemies.length; i++) {
                var enemy = this.level.enemies[i];
                if (enemy.phasing)
                    continue;
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
        }
        if (!this.isOutOfMap(this.x + next_step_x, this.y + next_step_y)) {
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
    Character.prototype.newStatus = function (status) {
        this.level.socket.to(this.id).emit('new_status', status);
    };
    Character.prototype.updateStatus = function () {
    };
    Character.prototype.moveIsPressed = function () {
        return this.pressed['w'] || this.pressed['s'] || this.pressed['d'] || this.pressed['a'];
    };
    Character.prototype.idleAct = function () {
        var _this = this;
        var _a, _b;
        if (this.pressed.l_click) {
            if (this.can_use_skills && ((_a = this.first_ab) === null || _a === void 0 ? void 0 : _a.canUse())) {
                this.useNotUtilityTriggers.forEach(function (elem) {
                    elem.trigger(_this);
                });
                (_b = this.first_ab) === null || _b === void 0 ? void 0 : _b.use();
                this.last_skill_used_time = this.time;
            }
        }
        else if (this.pressed.r_click) {
            this.useSecond();
        }
        else if (this.pressed[' ']) {
            this.setState(this.setDefend);
        }
        else if (this.pressed['e'] && this.can_use_skills) {
            this.useUtility();
        }
    };
    Character.prototype.setDefend = function () {
        var _this = this;
        this.state = 'defend';
        this.stateAct = this.defendAct;
        var reduce = 80 - this.agility * 5;
        this.addMoveSpeedPenalty(-reduce);
        this.cancelAct = function () {
            _this.addMoveSpeedPenalty(reduce);
        };
    };
    Character.prototype.defendAct = function () {
        if (!this.pressed[' ']) {
            this.getState();
        }
    };
    Character.prototype.act = function (time) {
        this.time = time;
        if (!this.can_act || !this.stateAct)
            return;
        // console.log(this.z)
        this.stateAct();
        this.moveAct();
        this.regen();
    };
    Character.prototype.setIdleState = function () {
        this.state = 'idle';
        this.stateAct = this.idleAct;
    };
    Character.prototype.getState = function () {
        if (this.is_dead) {
            return;
        }
        else {
            this.setState(this.setIdleState);
        }
    };
    Character.prototype.setLastInputs = function (pressed) {
        this.pressed = pressed;
    };
    return Character;
}(Unit_1.default));
exports.default = Character;
