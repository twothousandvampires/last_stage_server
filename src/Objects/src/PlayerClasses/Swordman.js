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
var Charge_1 = require("../../../Abilities/Swordman/Charge");
var Commands_1 = require("../../../Abilities/Swordman/Commands");
var CursedWeapon_1 = require("../../../Abilities/Swordman/CursedWeapon");
var Jump_1 = require("../../../Abilities/Swordman/Jump");
var Quake_1 = require("../../../Abilities/Swordman/Quake");
var ShatteredWeapon_1 = require("../../../Abilities/Swordman/ShatteredWeapon");
var WeaponSwing_1 = require("../../../Abilities/Swordman/WeaponSwing");
var WeaponThrow_1 = require("../../../Abilities/Swordman/WeaponThrow");
var Whirlwind_1 = require("../../../Abilities/Swordman/Whirlwind");
var Func_1 = require("../../../Func");
var Armour_1 = require("../../Effects/Armour");
var Blood_1 = require("../../Effects/Blood");
var Character_1 = require("../Character");
var Swordman = /** @class */ (function (_super) {
    __extends(Swordman, _super);
    function Swordman(level) {
        var _this = _super.call(this, level) || this;
        _this.weapon_angle = 0.8;
        _this.attack_radius = 7;
        _this.attack_speed = 1500;
        _this.name = 'swordman';
        _this.move_speed = 0.5;
        _this.avoid_damaged_state_chance = 10;
        _this.chance_to_get_additional_point = 0;
        _this.chance_to_hit_additional_target = 0;
        _this.armour_rate = 15;
        _this.resource = 0;
        _this.max_resource = 7;
        _this.life_status = 3;
        _this.base_regen_time = 10000;
        _this.recent_kills = [];
        return _this;
    }
    Swordman.prototype.getTargetsCount = function () {
        return this.might + 1;
    };
    Swordman.prototype.succesefulKill = function () {
        var _this = this;
        this.onKillTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
        if (Func_1.default.chance(this.knowledge * 3)) {
            this.recent_kills.push(this.time);
        }
        this.recent_kills.push(this.time);
    };
    Swordman.prototype.getAttackMoveSpeedPenalty = function () {
        return 70 - (this.agility * 3);
    };
    Swordman.prototype.createAbilities = function (abilities) {
        var main_name = abilities.find(function (elem) { return elem.type === 1 && elem.selected; }).name;
        if (main_name === 'swing') {
            this.first_ab = new WeaponSwing_1.default(this);
        }
        else if (main_name === 'weapon throw') {
            this.first_ab = new WeaponThrow_1.default(this);
        }
        var secondary_name = abilities.find(function (elem) { return elem.type === 2 && elem.selected; }).name;
        if (secondary_name === 'jump') {
            this.second_ab = new Jump_1.default(this);
        }
        else if (secondary_name === 'charge') {
            this.second_ab = new Charge_1.default(this);
        }
        var finisher_name = abilities.find(function (elem) { return elem.type === 3 && elem.selected; }).name;
        if (finisher_name === 'whirlwind') {
            this.third_ab = new Whirlwind_1.default(this);
        }
        else if (finisher_name === 'quake') {
            this.third_ab = new Quake_1.default(this);
        }
        var utility_name = abilities.find(function (elem) { return elem.type === 4 && elem.selected; }).name;
        if (utility_name === 'cursed weapon') {
            this.utility = new CursedWeapon_1.default(this);
        }
        else if (utility_name === 'commands') {
            this.utility = new Commands_1.default(this);
        }
    };
    Swordman.prototype.takeDamage = function (unit, options) {
        if (unit === void 0) { unit = undefined; }
        if (options === void 0) { options = {}; }
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
        var b_chance = 50 + this.agility * 3;
        if (b_chance > 90) {
            b_chance = 90;
        }
        if (this.state === 'defend' && Func_1.default.chance(b_chance)) {
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y
            });
            return;
        }
        var arm = this.armour_rate > 95 ? 95 : this.armour_rate;
        if (Func_1.default.chance(arm)) {
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y
            });
            var e_1 = new Armour_1.default(this.level);
            e_1.setPoint(Func_1.default.random(this.x - 2, this.x + 2), this.y);
            e_1.z = Func_1.default.random(2, 8);
            this.level.effects.push(e_1);
            return;
        }
        this.level.sounds.push({
            name: 'sword hit',
            x: this.x,
            y: this.y
        });
        var e = new Blood_1.default(this.level);
        e.setPoint(Func_1.default.random(this.x - 2, this.x + 2), this.y);
        e.z = Func_1.default.random(2, 8);
        this.level.effects.push(e);
        if (!Func_1.default.chance(this.might * 6)) {
            this.recent_kills = this.recent_kills.filter(function (elem, index) { return index >= 4; });
        }
        this.subLife(unit, options);
    };
    Swordman.prototype.getSkipDamageStateChance = function () {
        return this.avoid_damaged_state_chance + this.will * 5;
    };
    Swordman.prototype.getRegenTimer = function () {
        return this.base_regen_time - this.will * 150;
    };
    Swordman.prototype.getAllUpgrades = function () {
        return [
            {
                name: 'echo swing',
                canUse: function (character) {
                    return character.first_ab instanceof WeaponSwing_1.default && !character.first_ab.echo_swing;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof WeaponSwing_1.default) {
                        character.first_ab.echo_swing = true;
                    }
                },
                cost: 1,
                desc: 'gives your weapon swing chance to land an additional swing after a short time'
            },
            {
                name: 'improved swing technology',
                canUse: function (character) {
                    return character.first_ab instanceof WeaponSwing_1.default && !character.first_ab.improved_swing_technology;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof WeaponSwing_1.default) {
                        character.first_ab.improved_swing_technology = true;
                    }
                },
                cost: 2,
                desc: 'gives your weapon swing chance to increase move and attack speed for a short period'
            },
            {
                name: 'light grip',
                canUse: function (character) {
                    return character.first_ab instanceof WeaponThrow_1.default && !character.first_ab.light_grip;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof WeaponThrow_1.default) {
                        character.first_ab.light_grip = true;
                    }
                },
                cost: 3,
                desc: 'gives your weapon throw ability a chance to reduce cd time between uses by 50%'
            },
            {
                name: 'returning',
                canUse: function (character) {
                    return character.first_ab instanceof WeaponThrow_1.default && !character.first_ab.returning && !character.first_ab.shattering;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof WeaponThrow_1.default) {
                        character.first_ab.returning = true;
                    }
                },
                cost: 3,
                desc: 'gives your weapon throw ability a chance to return, will icreases that chance'
            },
            {
                name: 'shattering',
                canUse: function (character) {
                    return character.first_ab instanceof WeaponThrow_1.default && !character.first_ab.returning && !character.first_ab.shattering;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof WeaponThrow_1.default) {
                        character.first_ab.shattering = true;
                    }
                },
                cost: 3,
                desc: 'gives your weapon throw ability a chance to shatter up to 3 shards'
            },
            {
                name: 'heavy landing',
                canUse: function (character) {
                    return character.second_ab instanceof Jump_1.default && !character.second_ab.heavy_landing;
                },
                teach: function (character) {
                    if (character.second_ab && character.second_ab instanceof Jump_1.default) {
                        character.second_ab.heavy_landing = true;
                    }
                },
                cost: 2,
                desc: 'after landing your get armour by each hited enemy'
            },
            {
                name: 'stomp',
                canUse: function (character) {
                    return character.second_ab instanceof Jump_1.default && !character.second_ab.stomp;
                },
                teach: function (character) {
                    if (character.second_ab && character.second_ab instanceof Jump_1.default) {
                        character.second_ab.stomp = true;
                    }
                },
                cost: 5,
                desc: 'increases the radius in which enemies will take damage'
            },
            {
                name: 'destroyer',
                canUse: function (character) {
                    return character.second_ab instanceof Charge_1.default && !character.second_ab.destroyer;
                },
                teach: function (character) {
                    if (character.second_ab && character.second_ab instanceof Charge_1.default) {
                        character.second_ab.destroyer = true;
                    }
                },
                cost: 3,
                desc: 'gives a chance based by your might to deal damage to your charge ability'
            },
            {
                name: 'vision of possibilities',
                canUse: function (character) {
                    return character.second_ab instanceof Charge_1.default && !character.second_ab.possibilities;
                },
                teach: function (character) {
                    if (character.second_ab && character.second_ab instanceof Charge_1.default) {
                        character.second_ab.possibilities = true;
                    }
                },
                cost: 1,
                desc: 'if you hit 3 or more enemies you have a chance to get resourse(chance increases by agility)'
            },
            {
                name: 'blood harvest',
                canUse: function (character) {
                    return character.third_ab instanceof Whirlwind_1.default && !character.third_ab.blood_harvest;
                },
                teach: function (character) {
                    if (character.third_ab && character.third_ab instanceof Whirlwind_1.default) {
                        character.third_ab.blood_harvest = true;
                    }
                },
                cost: 3,
                desc: 'after use whirlwind you have a chance to create blood sphere based of count of killed enemies'
            },
            {
                name: 'fan of swords',
                canUse: function (character) {
                    return character.third_ab instanceof Whirlwind_1.default && !character.third_ab.fan_of_swords;
                },
                teach: function (character) {
                    if (character.third_ab && character.third_ab instanceof Whirlwind_1.default) {
                        character.third_ab.fan_of_swords = true;
                    }
                },
                cost: 10,
                desc: 'your whirlwind now fires fan of swords equals your strength inproves of weapon throw ability also works'
            },
            {
                name: 'consequences',
                canUse: function (character) {
                    return character.third_ab instanceof Quake_1.default && !character.third_ab.consequences;
                },
                teach: function (character) {
                    if (character.third_ab && character.third_ab instanceof Quake_1.default) {
                        character.third_ab.consequences = true;
                    }
                },
                cost: 3,
                desc: 'quake have a biger radius but also have incresed weakness duration'
            },
            {
                name: 'selfcare',
                canUse: function (character) {
                    return character.third_ab instanceof Quake_1.default && !character.third_ab.selfcare;
                },
                teach: function (character) {
                    if (character.third_ab && character.third_ab instanceof Quake_1.default) {
                        character.third_ab.selfcare = true;
                    }
                },
                cost: 1,
                desc: 'your quake ability dont deal damage to you'
            },
            {
                name: 'drinker',
                canUse: function (character) {
                    return character.utility instanceof CursedWeapon_1.default && !character.utility.drinker;
                },
                teach: function (character) {
                    if (character.utility && character.utility instanceof CursedWeapon_1.default) {
                        character.utility.drinker = true;
                    }
                },
                cost: 1,
                desc: 'while you affect by cursed weapon after kill you have a chance to restore life'
            },
            {
                name: 'fast commands',
                canUse: function (character) {
                    return character.utility instanceof Commands_1.default && !character.utility.fast_commands;
                },
                teach: function (character) {
                    if (character.utility && character.utility instanceof Commands_1.default) {
                        character.utility.fast_commands = true;
                    }
                },
                cost: 1,
                desc: 'buff is shorter but stronger'
            },
            {
                name: 'shattered weapon',
                canUse: function (character) {
                    return !(character.second_ab instanceof ShatteredWeapon_1.default);
                },
                teach: function (character) {
                    if (character instanceof Swordman) {
                        character.second_ab = new ShatteredWeapon_1.default(character);
                        character.updateClientSkill();
                    }
                },
                cost: 1,
                desc: 'fires a magic fragments of your weapon when it hits walls or enemies when it returns and gives armour'
            },
            {
                name: 'searching weapon',
                canUse: function (character) {
                    return character.attack_radius < 10;
                },
                teach: function (character) {
                    if (character instanceof Swordman) {
                        character.attack_radius++;
                    }
                },
                cost: 1,
                desc: 'increases weapon attack range'
            },
            {
                name: 'attack speed',
                canUse: function (character) {
                    return character.attack_speed > 1000;
                },
                teach: function (character) {
                    if (character instanceof Swordman) {
                        character.attack_speed -= 100;
                    }
                },
                cost: 1,
                desc: 'increases weapon attack speed'
            },
            {
                name: 'discipline',
                canUse: function (character) {
                    return character.max_resource < 12;
                },
                teach: function (character) {
                    if (character instanceof Swordman) {
                        character.max_resource++;
                    }
                },
                cost: 1,
                desc: 'increases maximum of resources'
            },
        ];
    };
    Swordman.prototype.generateUpgrades = function () {
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
    Swordman.prototype.startGame = function () {
        var _a;
        var time = Date.now();
        (_a = this.item) === null || _a === void 0 ? void 0 : _a.equip(this);
        this.next_life_regen_time = time + this.getRegenTimer();
        this.check_recent_hits_timer = time + 1000;
    };
    Swordman.prototype.getSecondResourceTimer = function () {
        return 8000;
    };
    Swordman.prototype.regen = function () {
        var second_resouce_timer = this.getSecondResourceTimer();
        if (this.time >= this.check_recent_hits_timer) {
            this.check_recent_hits_timer += 1000;
            for (var i = this.recent_kills.length; i >= 0; i--) {
                var hit_time = this.recent_kills[i];
                if (this.time - hit_time >= second_resouce_timer) {
                    this.recent_kills.splice(i, 1);
                }
            }
        }
        if (this.time >= this.next_life_regen_time) {
            this.next_life_regen_time += this.getRegenTimer();
            this.addLife();
        }
    };
    Swordman.prototype.addLife = function (count, ignore_poison) {
        if (count === void 0) { count = 1; }
        if (ignore_poison === void 0) { ignore_poison = false; }
        if (!this.can_regen_life && !ignore_poison)
            return;
        for (var i = 0; i < count; i++) {
            var previous = this.life_status;
            if (previous > 3) {
                return;
            }
            if (previous === 3) {
                if (Func_1.default.random() >= this.durability * 10) {
                    return;
                }
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
    Swordman.prototype.setDamagedAct = function () {
        var _this = this;
        this.damaged = true;
        this.state = 'damaged';
        this.can_move_by_player = false;
        this.stateAct = this.damagedAct;
        this.cancelAct = function () {
            _this.can_move_by_player = true;
            _this.damaged = false;
        };
        this.setTimerToGetState(300 - this.durability * 20);
    };
    Swordman.prototype.useUtility = function () {
        var _a;
        (_a = this.utility) === null || _a === void 0 ? void 0 : _a.use();
    };
    Swordman.prototype.toJSON = function () {
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
    Swordman.prototype.getSecondResource = function () {
        return this.recent_kills.length;
    };
    Swordman.prototype.getAttackSpeed = function () {
        return this.attack_speed - (this.speed * 50);
    };
    Swordman.prototype.useSecond = function () {
        var _this = this;
        var _a, _b, _c;
        if (!this.can_use_skills)
            return;
        if ((_a = this.third_ab) === null || _a === void 0 ? void 0 : _a.canUse()) {
            (_b = this.third_ab) === null || _b === void 0 ? void 0 : _b.use();
            this.third_ab.afterUse();
        }
        else if ((_c = this.second_ab) === null || _c === void 0 ? void 0 : _c.canUse()) {
            this.useNotUtilityTriggers.forEach(function (elem) {
                elem.trigger(_this);
            });
            this.second_ab.use();
            this.last_skill_used_time = this.time;
        }
    };
    Swordman.prototype.addResourse = function (count) {
        if (count === void 0) { count = 1; }
        this.addPoint(count);
    };
    Swordman.prototype.addPoint = function (count) {
        if (count === void 0) { count = 1; }
        if (!this.can_regen_resource)
            return;
        if (this.resource > this.max_resource) {
            return;
        }
        if (Func_1.default.chance(this.knowledge * 6)) {
            count++;
        }
        this.resource += count;
    };
    Swordman.prototype.succesefulHit = function () {
        var _this = this;
        this.onHitTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
    };
    Swordman.prototype.setDefend = function () {
        var _this = this;
        this.state = 'defend';
        this.stateAct = this.defendAct;
        var reduce = 80 - this.speed * 5;
        this.addMoveSpeedPenalty(-reduce);
        this.cancelAct = function () {
            _this.addMoveSpeedPenalty(reduce);
        };
    };
    return Swordman;
}(Character_1.default));
exports.default = Swordman;
