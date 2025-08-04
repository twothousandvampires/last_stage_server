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
var Fireball_1 = require("../../../Abilities/Flyer/Fireball");
var FlameWall_1 = require("../../../Abilities/Flyer/FlameWall");
var ForkedLightning_1 = require("../../../Abilities/Flyer/ForkedLightning");
var Frostnova_1 = require("../../../Abilities/Flyer/Frostnova");
var FrostSphere_1 = require("../../../Abilities/Flyer/FrostSphere");
var LightBeacon_1 = require("../../../Abilities/Flyer/LightBeacon");
var LightningBolt_1 = require("../../../Abilities/Flyer/LightningBolt");
var StaticField_1 = require("../../../Abilities/Flyer/StaticField");
var Teeth_1 = require("../../../Abilities/Flyer/Teeth");
var Teleportation_1 = require("../../../Abilities/Flyer/Teleportation");
var Func_1 = require("../../../Func");
var Armour_1 = require("../../Effects/Armour");
var Blood_1 = require("../../Effects/Blood");
var Lightning_1 = require("../../Projectiles/Lightning");
var Character_1 = require("../Character");
var Flyer = /** @class */ (function (_super) {
    __extends(Flyer, _super);
    function Flyer(level) {
        var _this = _super.call(this, level) || this;
        _this.cast_speed = 1500;
        _this.name = 'flyer';
        _this.move_speed = 0.4;
        _this.avoid_damaged_state_chance = 0;
        _this.armour_rate = 0;
        _this.resource = 0;
        _this.max_resource = 7;
        _this.life_status = 3;
        _this.base_regen_time = 15000;
        _this.takeoff = false;
        _this.allow_mana_regen_while_def = false;
        _this.charged_shield = false;
        _this.recent_cast = [];
        return _this;
    }
    Flyer.prototype.getAdditionalRadius = function () {
        return Math.floor(this.might / 2);
    };
    Flyer.prototype.getAllUpgrades = function () {
        return [
            {
                name: 'scorching',
                canUse: function (character) {
                    return character.second_ab instanceof FlameWall_1.default && !character.second_ab.scorching;
                },
                teach: function (character) {
                    var _a;
                    (_a = character === null || character === void 0 ? void 0 : character.second_ab) === null || _a === void 0 ? void 0 : _a.scorching = true;
                },
                cost: 1,
                desc: 'your flamewall burn burn faster'
            },
            {
                name: 'frendly flame',
                canUse: function (character) {
                    return character.second_ab instanceof FlameWall_1.default && !character.second_ab.frendly_flame;
                },
                teach: function (character) {
                    character.second_ab.frendly_flame = true;
                },
                cost: 1,
                desc: 'your flamewall does not damage players'
            },
            {
                name: 'takeoff',
                canUse: function (character) {
                    return character instanceof Flyer && !character.takeoff;
                },
                teach: function (character) {
                    character.takeoff = true;
                },
                cost: 1,
                desc: 'gives your phasing while you in defend stance'
            },
            {
                name: 'teeth',
                canUse: function (character) {
                    return character instanceof Flyer && !(character.first_ab instanceof Teeth_1.default);
                },
                teach: function (character) {
                    if (character instanceof Flyer) {
                        character.first_ab = new Teeth_1.default(character);
                        character.updateClientSkill();
                    }
                },
                cost: 1,
                desc: 'fires a sereral of teeth'
            },
            {
                name: 'body melting',
                canUse: function (character) {
                    return character instanceof Flyer && (character.first_ab instanceof Fireball_1.default) && !character.first_ab.body_melting;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.first_ab instanceof Fireball_1.default) {
                        character.first_ab.body_melting = true;
                    }
                },
                cost: 1,
                desc: 'gives your fireball a chance to pierce enemy'
            },
            {
                name: 'ignite',
                canUse: function (character) {
                    return character instanceof Flyer && (character.first_ab instanceof Fireball_1.default) && !character.first_ab.ignite;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.first_ab instanceof Fireball_1.default) {
                        character.first_ab.ignite = true;
                    }
                },
                cost: 1,
                desc: 'your fireball ignites the floor after explosion'
            },
            {
                name: 'hand of frost',
                canUse: function (character) {
                    return character instanceof Flyer && (character.first_ab instanceof FrostSphere_1.default) && !character.first_ab.frost_rich;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.first_ab instanceof FrostSphere_1.default) {
                        character.first_ab.frost_rich = true;
                    }
                },
                cost: 1,
                desc: 'increases radius of explosion'
            },
            {
                name: 'reign of frost',
                canUse: function (character) {
                    return character instanceof Flyer && (character.first_ab instanceof FrostSphere_1.default) && !character.first_ab.reign_of_frost;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.first_ab instanceof FrostSphere_1.default) {
                        character.first_ab.reign_of_frost = true;
                    }
                },
                cost: 1,
                desc: 'increases freeze duration'
            },
            {
                name: 'high voltage',
                canUse: function (character) {
                    return character instanceof Flyer && (character.first_ab instanceof LightningBolt_1.default) && !character.first_ab.high_voltage;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.first_ab instanceof LightningBolt_1.default) {
                        character.first_ab.high_voltage = true;
                    }
                },
                cost: 1,
                desc: 'now your lightning bolt does not apply shock and hit up to 3 targets by default also number of hitting enemies is increased by might'
            },
            {
                name: 'storm',
                canUse: function (character) {
                    return character instanceof Flyer && (character.first_ab instanceof LightningBolt_1.default) && !character.first_ab.storm;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.first_ab instanceof LightningBolt_1.default) {
                        character.first_ab.storm = true;
                        character.first_ab.cost += 1;
                    }
                },
                cost: 1,
                desc: 'now your lightning bolt also hit 2 additional times in close area but mana cost is increased'
            },
            {
                name: 'improved chain reaction',
                canUse: function (character) {
                    return character instanceof Flyer && (character.second_ab instanceof ForkedLightning_1.default) && !character.second_ab.improved_chain_reaction;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.second_ab instanceof ForkedLightning_1.default) {
                        character.second_ab.improved_chain_reaction = true;
                    }
                },
                cost: 1,
                desc: 'increases the chain chance to the following ones after first'
            },
            {
                name: 'lightning eye',
                canUse: function (character) {
                    return character instanceof Flyer && (character.second_ab instanceof ForkedLightning_1.default) && !character.second_ab.lightning_eye;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.second_ab instanceof ForkedLightning_1.default) {
                        character.second_ab.lightning_eye = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
            {
                name: 'lightning waves',
                canUse: function (character) {
                    return character instanceof Flyer && (character.third_ab instanceof LightBeacon_1.default) && !character.third_ab.lightning_waves;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.third_ab instanceof LightBeacon_1.default) {
                        character.third_ab.lightning_waves = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
            {
                name: 'air form',
                canUse: function (character) {
                    return character instanceof Flyer && (character.third_ab instanceof LightBeacon_1.default) && !character.third_ab.air_form;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.third_ab instanceof LightBeacon_1.default) {
                        character.third_ab.air_form = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
            {
                name: 'ice genesis',
                canUse: function (character) {
                    return character instanceof Flyer && (character.third_ab instanceof Frostnova_1.default) && !character.third_ab.ice_genesis;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.third_ab instanceof Frostnova_1.default) {
                        character.third_ab.ice_genesis = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
            {
                name: 'cold spires',
                canUse: function (character) {
                    return character instanceof Flyer && (character.third_ab instanceof Frostnova_1.default) && !character.third_ab.cold_spires;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.third_ab instanceof Frostnova_1.default) {
                        character.third_ab.cold_spires = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
            {
                name: 'hand cuffing',
                canUse: function (character) {
                    return character instanceof Flyer && (character.utility instanceof StaticField_1.default) && !character.utility.hand_cuffing;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.utility instanceof StaticField_1.default) {
                        character.utility.hand_cuffing = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
            {
                name: 'collapse',
                canUse: function (character) {
                    return character instanceof Flyer && (character.utility instanceof StaticField_1.default) && !character.utility.hand_cuffing;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.utility instanceof StaticField_1.default) {
                        character.utility.hand_cuffing = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
            {
                name: 'protected teleportation',
                canUse: function (character) {
                    return character instanceof Flyer && (character.utility instanceof Teleportation_1.default) && !character.utility.protected;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.utility instanceof Teleportation_1.default) {
                        character.utility.protected = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
            {
                name: 'increased gate',
                canUse: function (character) {
                    return character instanceof Flyer && (character.utility instanceof Teleportation_1.default) && !character.utility.increased_gate;
                },
                teach: function (character) {
                    if (character instanceof Flyer && character.utility instanceof Teleportation_1.default) {
                        character.utility.increased_gate = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
            {
                name: 'mana regen while defend',
                canUse: function (character) {
                    return character instanceof Flyer && !character.allow_mana_regen_while_def;
                },
                teach: function (character) {
                    if (character instanceof Flyer && !character.allow_mana_regen_while_def) {
                        character.allow_mana_regen_while_def = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
            {
                name: 'charged shield',
                canUse: function (character) {
                    return character instanceof Flyer && !character.charged_shield;
                },
                teach: function (character) {
                    if (character instanceof Flyer && !character.charged_shield) {
                        character.charged_shield = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of checking targets'
            },
        ];
    };
    Flyer.prototype.generateUpgrades = function () {
        var _this = this;
        if (this.upgrades.length)
            return;
        //get all upgrades for this class
        var p = _super.prototype.getAllUpgrades.call(this);
        var all = this.getAllUpgrades().concat(p);
        //filter by usability
        var filtered = all.filter(function (elem) {
            return elem.cost <= _this.grace && elem.canUse(_this);
        });
        //get 3 random ones
        filtered.sort(function (a, b) { return Math.random() > 0.5 ? 1 : -1; });
        filtered = filtered.slice(0, 3);
        //add to this.upgrades
        this.upgrades = this.upgrades.concat(filtered);
    };
    Flyer.prototype.castSound = function () {
        this.level.sounds.push({
            name: 'cast',
            x: this.x,
            y: this.y
        });
    };
    Flyer.prototype.getMoveSpeed = function () {
        var total_inc = this.move_speed_penalty;
        var speed = this.move_speed + (this.speed / 30);
        if (!total_inc)
            return speed;
        if (total_inc > 100)
            total_inc = 100;
        if (total_inc < -90)
            total_inc = -90;
        return speed * (1 + total_inc / 100);
    };
    Flyer.prototype.applyStats = function (stats) {
        for (var stat in stats) {
            this[stat] = stats[stat];
        }
        this.max_resource += this.knowledge;
    };
    Flyer.prototype.createAbilities = function (abilities) {
        var main_name = abilities.find(function (elem) { return elem.type === 1 && elem.selected; }).name;
        if (main_name === 'frost sphere') {
            this.first_ab = new FrostSphere_1.default(this);
        }
        else if (main_name === 'fireball') {
            this.first_ab = new Fireball_1.default(this);
        }
        else if (main_name === 'lightning bolt') {
            this.first_ab = new LightningBolt_1.default(this);
        }
        var secondary_name = abilities.find(function (elem) { return elem.type === 2 && elem.selected; }).name;
        if (secondary_name === 'forked lightning') {
            this.second_ab = new ForkedLightning_1.default(this);
        }
        else if (secondary_name === 'flamewall') {
            this.second_ab = new FlameWall_1.default(this);
        }
        var finisher_name = abilities.find(function (elem) { return elem.type === 3 && elem.selected; }).name;
        if (finisher_name === 'light beacon') {
            this.third_ab = new LightBeacon_1.default(this);
        }
        else if (finisher_name === 'frost nova') {
            this.third_ab = new Frostnova_1.default(this);
        }
        var utility_name = abilities.find(function (elem) { return elem.type === 4 && elem.selected; }).name;
        if (utility_name === 'teleportaion') {
            this.utility = new Teleportation_1.default(this);
        }
        else if (utility_name === 'static field') {
            this.utility = new StaticField_1.default(this);
        }
    };
    Flyer.prototype.setDefend = function () {
        var _this = this;
        this.state = 'defend';
        this.stateAct = this.defendAct;
        if (!this.allow_mana_regen_while_def) {
            this.can_regen_resource = false;
        }
        if (this.takeoff) {
            this.phasing = true;
        }
        this.cancelAct = function () {
            _this.can_regen_resource = true;
            _this.phasing = false;
        };
    };
    Flyer.prototype.getMoveSpeedPenaltyValue = function () {
        return 70 - (this.agility * 5);
    };
    Flyer.prototype.defendAct = function () {
        if (!this.pressed[' ']) {
            this.getState();
            this.can_regen_resource = true;
        }
    };
    Flyer.prototype.takeDamage = function (unit, options) {
        if (unit === void 0) { unit = undefined; }
        if (!this.can_be_damaged)
            return;
        if (options === null || options === void 0 ? void 0 : options.instant_death) {
            unit === null || unit === void 0 ? void 0 : unit.succesefulKill();
            this.is_dead = true;
            this.life_status = 0;
            this.setState(this.setDyingState);
            this.level.playerDead();
            return;
        }
        if (this.damaged || this.is_dead)
            return;
        this.playerWasHited();
        if (this.state === 'defend' && this.resource > 0) {
            if (this.charged_shield && Func_1.default.chance(50)) {
                var target = this.level.enemies[Math.floor(Math.random() * this.level.enemies.length)];
                if (target) {
                    var proj = new Lightning_1.Lightning(this.level);
                    proj.setOwner(this);
                    proj.setAngle(Func_1.default.angle(this.x, this.y, target.x, target.y));
                    proj.setPoint(this.x, this.y);
                    this.level.projectiles.push(proj);
                }
            }
            if (!Func_1.default.chance(this.will * 5)) {
                this.resource--;
            }
            return;
        }
        var arm = this.armour_rate + (this.agility * 5);
        arm = arm > 95 ? 95 : arm;
        if (Func_1.default.chance(arm)) {
            var e_1 = new Armour_1.default(this.level);
            e_1.setPoint(Func_1.default.random(this.x - 2, this.x + 2), this.y);
            e_1.z = Func_1.default.random(2, 8);
            this.level.effects.push(e_1);
            return;
        }
        var e = new Blood_1.default(this.level);
        e.setPoint(Func_1.default.random(this.x - 2, this.x + 2), this.y);
        e.z = Func_1.default.random(2, 8);
        this.level.effects.push(e);
        this.recent_cast = this.recent_cast.filter(function (elem, index) { return index >= 4; });
        this.subLife(unit, options);
    };
    Flyer.prototype.subLife = function (unit, options) {
        if (unit === void 0) { unit = undefined; }
        if (options === void 0) { options = {}; }
        this.life_status--;
        if (this.life_status <= 0) {
            this.playerTakeLethalDamage();
            if (this.can_be_lethaled) {
                if (options === null || options === void 0 ? void 0 : options.explode) {
                    this.exploded = true;
                }
                this.is_dead = true;
                unit === null || unit === void 0 ? void 0 : unit.succesefulKill();
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
    Flyer.prototype.getSkipDamageStateChance = function () {
        return this.avoid_damaged_state_chance + this.durability * 5;
    };
    Flyer.prototype.getRegenTimer = function () {
        return 15000 - this.durability * 200;
    };
    Flyer.prototype.getManaRegenTimer = function () {
        return 3000 - this.getSecondResource() * 100;
    };
    Flyer.prototype.startGame = function () {
        var _a;
        var time = Date.now();
        (_a = this.item) === null || _a === void 0 ? void 0 : _a.equip(this);
        this.next_life_regen_time = time + this.getRegenTimer();
        this.next_mana_regen_time = time + this.getManaRegenTimer();
        this.check_recent_hits_timer = time + 1000;
    };
    Flyer.prototype.regen = function () {
        if (this.time >= this.check_recent_hits_timer) {
            this.check_recent_hits_timer += 1000;
            for (var i = this.recent_cast.length; i >= 0; i--) {
                var hit_time = this.recent_cast[i];
                // todo timer
                if (this.time - hit_time >= 8000) {
                    this.recent_cast.splice(i, 1);
                }
            }
        }
        if (this.time >= this.next_life_regen_time) {
            this.next_life_regen_time += this.getRegenTimer();
            this.addLife();
        }
        if (this.time >= this.next_mana_regen_time) {
            this.next_mana_regen_time += this.getManaRegenTimer();
            if (this.can_regen_resource && !this.is_dead) {
                this.addResourse();
            }
        }
    };
    Flyer.prototype.addResourse = function (count) {
        if (count === void 0) { count = 1; }
        if (this.resource < this.max_resource) {
            this.resource += count;
        }
        if (this.resource < this.max_resource && Func_1.default.chance(this.will * 5)) {
            this.resource++;
        }
    };
    Flyer.prototype.setDamagedAct = function () {
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
    Flyer.prototype.useUtility = function () {
        var _a;
        (_a = this.utility) === null || _a === void 0 ? void 0 : _a.use();
    };
    Flyer.prototype.payCost = function () {
        var chance = this.knowledge * 2;
        if (chance > 70) {
            chance = 70;
        }
        if (!Func_1.default.chance(chance)) {
            this.resource -= this.pay_to_cost;
        }
        this.pay_to_cost = 0;
        this.recent_cast.push(this.time);
        if (Func_1.default.chance(this.speed * 2.5)) {
            this.recent_cast.push(this.time);
        }
    };
    Flyer.prototype.getSecondResource = function () {
        return this.recent_cast.length;
    };
    Flyer.prototype.toJSON = function () {
        var _a, _b, _c, _d;
        return Object.assign(_super.prototype.toJSON.call(this), {
            resource: this.resource,
            max_resource: this.max_resource,
            life_status: this.life_status,
            first: (_a = this.first_ab) === null || _a === void 0 ? void 0 : _a.canUse(),
            secondary: (_b = this.second_ab) === null || _b === void 0 ? void 0 : _b.canUse(),
            finisher: (_c = this.third_ab) === null || _c === void 0 ? void 0 : _c.canUse(),
            utility: (_d = this.utility) === null || _d === void 0 ? void 0 : _d.canUse(),
            second: this.getSecondResource()
        });
    };
    Flyer.prototype.getCastSpeed = function () {
        return this.cast_speed - this.getSecondResource() * 50;
    };
    Flyer.prototype.useSecond = function () {
        var _this = this;
        var _a, _b, _c;
        if (!this.can_use_skills)
            return;
        if ((_a = this.third_ab) === null || _a === void 0 ? void 0 : _a.canUse()) {
            this.useNotUtilityTriggers.forEach(function (elem) {
                elem.trigger(_this);
            });
            (_b = this.third_ab) === null || _b === void 0 ? void 0 : _b.use();
            this.last_skill_used_time = this.time;
        }
        else if ((_c = this.second_ab) === null || _c === void 0 ? void 0 : _c.canUse()) {
            this.useNotUtilityTriggers.forEach(function (elem) {
                elem.trigger(_this);
            });
            this.second_ab.use();
            this.last_skill_used_time = this.time;
        }
    };
    Flyer.prototype.succesefulHit = function () {
        var _this = this;
        this.onHitTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
    };
    return Flyer;
}(Character_1.default));
exports.default = Flyer;
