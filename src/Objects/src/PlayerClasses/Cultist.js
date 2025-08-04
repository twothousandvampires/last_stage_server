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
var GhostForm_1 = require("../../../Abilities/Cultist/GhostForm");
var GrimPile_1 = require("../../../Abilities/Cultist/GrimPile");
var PileOfThornCast_1 = require("../../../Abilities/Cultist/PileOfThornCast");
var Rune_1 = require("../../../Abilities/Cultist/Rune");
var SelfFlagellation_1 = require("../../../Abilities/Cultist/SelfFlagellation");
var ShieldBash_1 = require("../../../Abilities/Cultist/ShieldBash");
var Slam_1 = require("../../../Abilities/Cultist/Slam");
var SoulShatter_1 = require("../../../Abilities/Cultist/SoulShatter");
var UnleashPain_1 = require("../../../Abilities/Cultist/UnleashPain");
var Func_1 = require("../../../Func");
var Armour_1 = require("../../Effects/Armour");
var Blood_1 = require("../../Effects/Blood");
var Character_1 = require("../Character");
var Cultist = /** @class */ (function (_super) {
    __extends(Cultist, _super);
    function Cultist(level) {
        var _this = _super.call(this, level) || this;
        _this.weapon_angle = 1.6;
        _this.attack_point_radius = 4;
        _this.attack_radius = 7;
        _this.attack_speed = 1800;
        _this.cast_speed = 2000;
        _this.name = 'cultist';
        _this.move_speed = 0.4;
        _this.avoid_damaged_state_chance = 15;
        _this.armour_rate = 25;
        _this.resource = 0;
        _this.max_resource = 666;
        _this.hit_x = undefined;
        _this.hit_y = undefined;
        _this.life_status = 3;
        _this.base_regen_time = 9000;
        _this.service = false;
        _this.conduct_of_pain = false;
        _this.pain_extract = false;
        _this.recent_hits = [];
        return _this;
    }
    Cultist.prototype.getSkipDamageStateChance = function () {
        return this.avoid_damaged_state_chance + this.agility * 3;
    };
    Cultist.prototype.getMoveSpeed = function () {
        var total_inc = this.move_speed_penalty;
        var speed = this.move_speed + (this.agility / 35);
        if (!total_inc)
            return speed;
        if (total_inc > 100)
            total_inc = 100;
        if (total_inc < -90)
            total_inc = -90;
        return speed * (1 + total_inc / 100);
    };
    Cultist.prototype.createAbilities = function (abilities) {
        var main_name = abilities.find(function (elem) { return elem.type === 1 && elem.selected; }).name;
        if (main_name === 'slam') {
            this.first_ab = new Slam_1.default(this);
        }
        else if (main_name === 'rune') {
            this.first_ab = new Rune_1.default(this);
        }
        var secondary_name = abilities.find(function (elem) { return elem.type === 2 && elem.selected; }).name;
        if (secondary_name === 'shield bash') {
            this.second_ab = new ShieldBash_1.default(this);
        }
        else if (secondary_name === 'grim pile') {
            this.second_ab = new GrimPile_1.default(this);
        }
        var finisher_name = abilities.find(function (elem) { return elem.type === 3 && elem.selected; }).name;
        if (finisher_name === 'unleash pain') {
            this.third_ab = new UnleashPain_1.default(this);
        }
        else if (finisher_name === 'pile of thorns') {
            this.third_ab = new PileOfThornCast_1.default(this);
        }
        var utility_name = abilities.find(function (elem) { return elem.type === 4 && elem.selected; }).name;
        if (utility_name === 'self flagellation') {
            this.utility = new SelfFlagellation_1.default(this);
        }
        else if (utility_name === 'ghost form') {
            this.utility = new GhostForm_1.default(this);
        }
    };
    Cultist.prototype.addResourse = function (count) {
        if (count === void 0) { count = 1; }
        if (!this.can_regen_resource)
            return;
        for (var i = 0; i < count; i++) {
            this.recent_hits.push(this.time);
        }
        if (Func_1.default.chance(this.durability * 2)) {
            this.recent_hits.push(this.time);
        }
    };
    Cultist.prototype.subLife = function (unit, options) {
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
                this.addMoveSpeedPenalty(-5);
            }
            else if (this.life_status === 1) {
                this.addMoveSpeedPenalty(-10);
                this.reachNearDead();
            }
        }
    };
    Cultist.prototype.takeDamage = function (unit, options) {
        if (unit === void 0) { unit = undefined; }
        if (options === void 0) { options = {}; }
        if (!this.can_be_damaged)
            return;
        if (this.damaged || this.is_dead)
            return;
        if (options === null || options === void 0 ? void 0 : options.instant_death) {
            unit === null || unit === void 0 ? void 0 : unit.succesefulKill();
            this.is_dead = true;
            this.life_status = 0;
            this.setState(this.setDyingState);
            this.level.playerDead();
            return;
        }
        this.playerWasHited();
        var b_chance = 65 + this.durability;
        if (b_chance > 90) {
            b_chance = 90;
        }
        if (this.state === 'defend' && Func_1.default.chance(b_chance)) {
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y
            });
            if (this.conduct_of_pain && Func_1.default.chance(50)) {
                this.addResourse();
            }
            return;
        }
        this.addResourse();
        var arm = this.armour_rate + this.might;
        if (arm > Cultist.MAX_ARMOUR) {
            arm = Cultist.MAX_ARMOUR;
        }
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
        var will_avoid = this.will * 2;
        if (will_avoid > 50) {
            will_avoid = 50;
        }
        if (Func_1.default.chance(will_avoid)) {
            return;
        }
        this.subLife(unit, options);
    };
    Cultist.prototype.getSecondResource = function () {
        return this.recent_hits.length;
    };
    Cultist.prototype.getRegenTimer = function () {
        return this.base_regen_time - this.speed * 100;
    };
    Cultist.prototype.getAllUpgrades = function () {
        var _this = this;
        return [
            {
                name: 'runefield',
                canUse: function (character) {
                    return character.first_ab instanceof Rune_1.default && !character.first_ab.runefield;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof Rune_1.default) {
                        character.first_ab.runefield = true;
                        character.first_ab.cost++;
                    }
                },
                cost: 1,
                desc: 'gives your weapon swing chance to land an additional swing after a short time'
            },
            {
                name: 'explosive runes',
                canUse: function (character) {
                    return character.first_ab instanceof Rune_1.default && !character.first_ab.explosive;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof Rune_1.default) {
                        character.first_ab.explosive = true;
                        character.first_ab.cost++;
                    }
                },
                cost: 1,
                desc: 'gives your weapon swing chance to land an additional swing after a short time'
            },
            {
                name: 'fast detonation',
                canUse: function (character) {
                    return character.first_ab instanceof Rune_1.default && !character.first_ab.fast_detonation;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof Rune_1.default) {
                        character.first_ab.fast_detonation = true;
                    }
                },
                cost: 1,
                desc: 'gives your weapon swing chance to land an additional swing after a short time'
            },
            {
                name: 'second detanation',
                canUse: function (character) {
                    return character.first_ab instanceof Rune_1.default && !character.first_ab.second_detanation;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof Rune_1.default) {
                        character.first_ab.second_detanation = true;
                    }
                },
                cost: 1,
                desc: 'gives your weapon swing chance to land an additional swing after a short time'
            },
            {
                name: 'soul shatter',
                canUse: function (character) {
                    return !(character.first_ab instanceof SoulShatter_1.default);
                },
                teach: function (character) {
                    character.first_ab = new SoulShatter_1.default(_this);
                    character.updateClientSkill();
                },
                cost: 1,
                desc: 'gives your weapon swing chance to land an additional swing after a short time'
            },
            {
                name: 'slaming',
                canUse: function (character) {
                    return character.first_ab instanceof Slam_1.default && !character.first_ab.slaming;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof Slam_1.default) {
                        character.first_ab.slaming = true;
                    }
                },
                cost: 1,
                desc: 'increases the radius of slam hit'
            },
            {
                name: 'soul extraction',
                canUse: function (character) {
                    return character.first_ab instanceof Slam_1.default && !character.first_ab.soul_extraction;
                },
                teach: function (character) {
                    if (character.first_ab && character.first_ab instanceof Slam_1.default) {
                        character.first_ab.soul_extraction = true;
                    }
                },
                cost: 1,
                desc: 'increases the chance to get grace from killing enemies'
            },
            {
                name: 'deafening wave',
                canUse: function (character) {
                    return character.second_ab instanceof ShieldBash_1.default &&
                        !character.second_ab.deafening_wave &&
                        !character.second_ab.hate;
                },
                teach: function (character) {
                    if (character.second_ab && character.second_ab instanceof ShieldBash_1.default) {
                        character.second_ab.deafening_wave = true;
                    }
                },
                cost: 1,
                desc: 'increases duration the radius of stuning'
            },
            {
                name: 'hate',
                canUse: function (character) {
                    return character.second_ab instanceof ShieldBash_1.default &&
                        !character.second_ab.deafening_wave &&
                        !character.second_ab.hate;
                },
                teach: function (character) {
                    if (character.second_ab && character.second_ab instanceof ShieldBash_1.default) {
                        character.second_ab.hate = true;
                    }
                },
                cost: 1,
                desc: 'now your shield bash does not stun instead it has a chance to shatter enemy and to realise they bones that also can damage enemy'
            },
            {
                name: 'coordination',
                canUse: function (character) {
                    return character.second_ab instanceof ShieldBash_1.default &&
                        !character.second_ab.coordination;
                },
                teach: function (character) {
                    if (character.second_ab && character.second_ab instanceof ShieldBash_1.default) {
                        character.second_ab.coordination = true;
                    }
                },
                cost: 1,
                desc: 'now your shield bash has a chance to reduce attack speed by 50%'
            },
            {
                name: 'increase grim pile effect',
                canUse: function (character) {
                    return character.second_ab instanceof GrimPile_1.default &&
                        !character.second_ab.increased_effect;
                },
                teach: function (character) {
                    if (character.second_ab && character.second_ab instanceof GrimPile_1.default) {
                        character.second_ab.increased_effect = true;
                    }
                },
                cost: 1,
                desc: 'now your shield bash has a chance to reduce attack speed by 50%'
            },
            {
                name: 'grim pile of will',
                canUse: function (character) {
                    return character.second_ab instanceof GrimPile_1.default &&
                        !character.second_ab.resistance;
                },
                teach: function (character) {
                    if (character.second_ab && character.second_ab instanceof GrimPile_1.default) {
                        character.second_ab.resistance = true;
                    }
                },
                cost: 1,
                desc: 'now your shield bash has a chance to reduce attack speed by 50%'
            },
            {
                name: 'reign of pain',
                canUse: function (character) {
                    return character.third_ab instanceof UnleashPain_1.default &&
                        !character.third_ab.reign_of_pain;
                },
                teach: function (character) {
                    if (character.third_ab && character.third_ab instanceof UnleashPain_1.default) {
                        character.third_ab.reign_of_pain = true;
                    }
                },
                cost: 1,
                desc: 'increases radius for searching enemies and count of ghost warriors for each damage you get recently'
            },
            {
                name: 'restless warriors',
                canUse: function (character) {
                    return character.third_ab instanceof UnleashPain_1.default &&
                        !character.third_ab.restless_warriors;
                },
                teach: function (character) {
                    if (character.third_ab && character.third_ab instanceof UnleashPain_1.default) {
                        character.third_ab.restless_warriors = true;
                    }
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'ring of pain',
                canUse: function (character) {
                    return character.third_ab instanceof PileOfThornCast_1.default &&
                        !character.third_ab.ring_of_pain;
                },
                teach: function (character) {
                    if (character.third_ab && character.third_ab instanceof PileOfThornCast_1.default) {
                        character.third_ab.ring_of_pain = true;
                    }
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'collection of bones',
                canUse: function (character) {
                    return character.third_ab instanceof PileOfThornCast_1.default &&
                        !character.third_ab.collection_of_bones;
                },
                teach: function (character) {
                    if (character.third_ab && character.third_ab instanceof PileOfThornCast_1.default) {
                        character.third_ab.collection_of_bones = true;
                    }
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'pack with dead',
                canUse: function (character) {
                    return character.utility instanceof SelfFlagellation_1.default &&
                        !character.utility.pack;
                },
                teach: function (character) {
                    if (character.utility && character.utility instanceof SelfFlagellation_1.default) {
                        character.utility.pack = true;
                    }
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'lesson of pain',
                canUse: function (character) {
                    return character.utility instanceof SelfFlagellation_1.default &&
                        !character.utility.lesson;
                },
                teach: function (character) {
                    if (character.utility && character.utility instanceof SelfFlagellation_1.default) {
                        character.utility.lesson = true;
                    }
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'leaded by shost',
                canUse: function (character) {
                    return character.utility instanceof GhostForm_1.default &&
                        !character.utility.lead;
                },
                teach: function (character) {
                    if (character.utility && character.utility instanceof GhostForm_1.default) {
                        character.utility.lead = true;
                    }
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'afterlife cold',
                canUse: function (character) {
                    return character.utility instanceof GhostForm_1.default &&
                        !character.utility.afterlife_cold;
                },
                teach: function (character) {
                    if (character.utility && character.utility instanceof GhostForm_1.default) {
                        character.utility.afterlife_cold = true;
                    }
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'service',
                canUse: function (character) {
                    return !character.service;
                },
                teach: function (character) {
                    character.service = true;
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'conduct of pain',
                canUse: function (character) {
                    return !character.conduct_of_pain;
                },
                teach: function (character) {
                    character.conduct_of_pain = true;
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'pain extract',
                canUse: function (character) {
                    return !character.pain_extract;
                },
                teach: function (character) {
                    character.pain_extract = true;
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
        ];
    };
    Cultist.prototype.generateUpgrades = function () {
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
    Cultist.prototype.startGame = function () {
        var _a;
        var time = Date.now();
        (_a = this.item) === null || _a === void 0 ? void 0 : _a.equip(this);
        this.next_life_regen_time = time + this.getRegenTimer();
        this.check_recent_hits_timer = time + 1000;
    };
    Cultist.prototype.getSecondResourceTimer = function () {
        return 20000 + this.knowledge * 100;
    };
    Cultist.prototype.regen = function () {
        var second_resouce_timer = this.getSecondResourceTimer();
        if (this.time >= this.check_recent_hits_timer) {
            this.check_recent_hits_timer += 1000;
            for (var i = this.recent_hits.length; i >= 0; i--) {
                var hit_time = this.recent_hits[i];
                if (this.time - hit_time >= second_resouce_timer) {
                    this.recent_hits.splice(i, 1);
                }
            }
        }
        if (this.time >= this.next_life_regen_time) {
            this.next_life_regen_time += this.getRegenTimer();
            this.addLife();
            if (this.service) {
                if (Func_1.default.chance(this.getSecondResource() * 10)) {
                    this.addResourse();
                }
            }
        }
    };
    Cultist.prototype.succesefulKill = function () {
        var _this = this;
        this.onKillTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
        if (this.pain_extract && Func_1.default.chance(5)) {
            this.addResourse();
        }
    };
    Cultist.prototype.addLife = function (count, ignore_poison) {
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
                this.addMoveSpeedPenalty(10);
            }
            if (previous === 2) {
                this.addMoveSpeedPenalty(5);
            }
        }
    };
    Cultist.prototype.setDamagedAct = function () {
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
    Cultist.prototype.useUtility = function () {
        var _a;
        (_a = this.utility) === null || _a === void 0 ? void 0 : _a.use();
    };
    Cultist.prototype.toJSON = function () {
        var _a, _b, _c, _d;
        return Object.assign(_super.prototype.toJSON.call(this), {
            resource: this.getSecondResource(),
            max_resource: this.max_resource,
            life_status: this.life_status,
            first: (_a = this.first_ab) === null || _a === void 0 ? void 0 : _a.canUse(),
            secondary: (_b = this.second_ab) === null || _b === void 0 ? void 0 : _b.canUse(),
            finisher: (_c = this.third_ab) === null || _c === void 0 ? void 0 : _c.canUse(),
            utility: (_d = this.utility) === null || _d === void 0 ? void 0 : _d.canUse(),
            second: this.getSecondResource()
        });
    };
    Cultist.prototype.getAttackSpeed = function () {
        var value = this.attack_speed - (this.might * 100);
        if (value < Cultist.MIN_ATTACK_SPEED) {
            value = Cultist.MIN_ATTACK_SPEED;
        }
        return value;
    };
    Cultist.prototype.useSecond = function () {
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
    Cultist.prototype.succesefulHit = function () {
        var _this = this;
        this.onHitTriggers.forEach(function (elem) {
            elem.trigger(_this);
        });
    };
    Cultist.prototype.getCastSpeed = function () {
        var value = this.cast_speed - (this.speed * 100);
        if (value < Cultist.MIN_CAST_SPEED) {
            value = Cultist.MIN_ATTACK_SPEED;
        }
        return value;
    };
    Cultist.prototype.payCost = function () {
        var _this = this;
        if (!Func_1.default.chance(this.knowledge * 3)) {
            this.recent_hits = this.recent_hits.filter(function (elem, index) { return index >= _this.pay_to_cost; });
        }
        this.pay_to_cost = 0;
    };
    Cultist.prototype.isStatusResist = function () {
        return Func_1.default.chance(this.status_resistance + (this.will * 3));
    };
    Cultist.MIN_ATTACK_SPEED = 200;
    Cultist.MIN_CAST_SPEED = 400;
    Cultist.MAX_ARMOUR = 95;
    return Cultist;
}(Character_1.default));
exports.default = Cultist;
