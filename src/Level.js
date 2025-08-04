"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var Impy_1 = require("./Objects/src/Enemy/Impy");
var Flamy_1 = require("./Objects/src/Enemy/Flamy");
var Solid_1 = require("./Objects/src/Enemy/Solid");
var Bones_1 = require("./Objects/src/Enemy/Bones");
var GraceShard_1 = require("./Objects/Effects/GraceShard");
var Func_1 = require("./Func");
var Split_1 = require("./Objects/Effects/Split");
var ChargedSphere_1 = require("./Objects/Effects/ChargedSphere");
var Grace_1 = require("./Objects/Effects/Grace");
var FlyingBones_1 = require("./Objects/src/Enemy/FlyingBones");
var Specter_1 = require("./Objects/src/Enemy/Specter");
var PileOfVeil_1 = require("./Objects/src/Piles/PileOfVeil");
var PileOfFrost_1 = require("./Objects/src/Piles/PileOfFrost");
var PileOfStorm_1 = require("./Objects/src/Piles/PileOfStorm");
var PileOfEvil_1 = require("./Objects/src/Piles/PileOfEvil");
var PileOfSummoning_1 = require("./Objects/src/Piles/PileOfSummoning");
var BannerOfArmour_1 = require("./Status/BannerOfArmour");
var Intervention_1 = require("./Objects/Effects/Intervention");
var Gifter_1 = require("./Objects/src/Enemy/Gifter");
var Level = /** @class */ (function () {
    function Level(socket, server) {
        this.server = server;
        this.time_between_wave_ms = 7500;
        this.socket = socket;
        this.enemies = [];
        this.players = [];
        this.projectiles = [];
        this.effects = [];
        this.dead = [];
        this.deleted = [];
        this.bindedEffects = [];
        this.sounds = [];
        this.statusPull = [];
        this.last_id = 0;
        this.kill_count = 0;
        this.grace_trashold = 5;
        this.time = Date.now();
    }
    Level.prototype.addSoundObject = function (sound) {
        this.sounds.push(sound);
    };
    Level.prototype.addSound = function (name, x, y) {
        this.sounds.push({
            name: name,
            x: x,
            y: y
        });
    };
    Level.prototype.playerDead = function () {
        var _this = this;
        this.players.forEach(function (p) {
            p.playerDead();
        });
        if (this.players.every(function (elem) { return elem.is_dead; })) {
            setTimeout(function () {
                _this.server.endOfLevel();
            }, 3000);
            return;
        }
    };
    Level.prototype.getId = function () {
        return this.last_id++;
    };
    Level.prototype.assignPlayer = function (player) {
        player.startGame();
        this.players.push(player);
    };
    Level.prototype.stop = function () {
        console.log('level was STOPPED');
        clearInterval(this.create);
        this.create = undefined;
        this.enemies = [];
        this.players = [];
        this.bindedEffects = [];
        this.statusPull = [];
        this.projectiles.length = 0;
        this.sounds.length = 0;
        this.effects.length = 0;
    };
    Level.prototype.createWave = function () {
        var player_in_zone = this.players.some(function (elem) { return elem.zone_id === 0; });
        if (!player_in_zone)
            return;
        var count = Func_1.default.random(1, 3);
        count += Math.floor(this.kill_count / 35);
        for (var i = 0; i < count; i++) {
            var enemy_name = undefined;
            var w = Math.random() * Level.enemy_list.reduce(function (acc, elem) { return acc + elem.weight; }, 0);
            var w2 = 0;
            for (var _i = 0, _a = Level.enemy_list; _i < _a.length; _i++) {
                var item = _a[_i];
                w2 += item.weight;
                if (w <= w2) {
                    enemy_name = item.name;
                    break;
                }
            }
            if (enemy_name === undefined) {
                continue;
            }
            var enemy = undefined;
            if (enemy_name === 'solid') {
                enemy = new Solid_1.default(this);
            }
            else if (enemy_name === 'flying bones') {
                enemy = new FlyingBones_1.default(this);
            }
            else if (enemy_name === 'bones') {
                enemy = new Bones_1.default(this);
            }
            else if (enemy_name === 'flamy') {
                enemy = new Flamy_1.Flamy(this);
            }
            else if (enemy_name === 'specter') {
                enemy = new Specter_1.default(this);
            }
            else if (enemy_name === 'impy') {
                enemy = new Impy_1.default(this);
            }
            else if (enemy_name === 'gifter') {
                enemy = new Gifter_1.default(this);
            }
            else if (enemy_name === 'pile') {
                var variants = ['evil', 'frost', 'blind', 'shock', 'summon'];
                var name_1 = variants[Math.floor(Math.random() * variants.length)];
                switch (name_1) {
                    case 'evil':
                        enemy = new PileOfEvil_1.default(this);
                        break;
                    case 'frost':
                        enemy = new PileOfFrost_1.default(this);
                        break;
                    case 'blind':
                        enemy = new PileOfVeil_1.default(this);
                        break;
                    case 'shock':
                        enemy = new PileOfStorm_1.default(this);
                        break;
                    case 'shock':
                        enemy = new PileOfSummoning_1.default(this);
                        break;
                }
            }
            if (!enemy) {
                continue;
            }
            while (enemy.isOutOfMap()) {
                var players_in_zone = this.players.filter(function (elem) { return elem.zone_id === 0; });
                var random_player = players_in_zone[Math.floor(Math.random() * players_in_zone.length)];
                var angle = Math.random() * 6.28;
                var distance_x = Func_1.default.random(15, 30);
                var distance_y = Func_1.default.random(15, 30);
                enemy.setPoint(random_player.x + Math.sin(angle) * distance_x, random_player.y + Math.cos(angle) * distance_y);
            }
            if (enemy instanceof Solid_1.default && Func_1.default.chance(15)) {
                var status_1 = new BannerOfArmour_1.default(this.time, 0);
                this.setStatus(enemy, status_1);
            }
            this.enemies.push(enemy);
        }
    };
    Level.prototype.start = function () {
        var _this = this;
        console.log('level was STARTED');
        this.create = setInterval(function () {
            _this.createWave();
        }, this.time_between_wave_ms);
    };
    Level.prototype.toJSON = function () {
        return {
            actors: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], this.players, true), this.enemies, true), this.projectiles, true), this.effects, true), this.bindedEffects, true),
            deleted: this.deleted,
            sounds: this.sounds
        };
    };
    Level.prototype.setStatus = function (unit, status, with_check) {
        if (with_check === void 0) { with_check = false; }
        if (status.checkResist(unit)) {
            return;
        }
        if (with_check) {
            var exist = this.statusPull.find(function (elem) { return elem.unit === unit && elem.name === status.name; });
            if (exist) {
                exist.update(status);
                return;
            }
        }
        status.apply(unit);
        this.statusPull.push(status);
    };
    Level.prototype.tick = function () {
        var _this = this;
        this.time = Date.now();
        this.players.forEach(function (player) {
            player.act(_this.time);
        });
        this.projectiles.forEach(function (proj) {
            proj.act(_this.time);
        });
        this.enemies.forEach(function (enemy) {
            enemy.act(_this.time);
        });
        this.bindedEffects.forEach(function (effect) {
            effect.act(_this.time);
        });
        this.statusPull.forEach(function (status) {
            if (status.isExpired(_this.time)) {
                status.clear();
                _this.statusPull = _this.statusPull.filter(function (elem) { return elem != status; });
            }
            else if (status.unit && status.unit.is_dead) {
                status === null || status === void 0 ? void 0 : status.unitDead();
                status.clear();
                _this.statusPull = _this.statusPull.filter(function (elem) { return elem != status; });
            }
            else {
                status.act(_this.time);
            }
        });
        // console.log(Date.now() - s)
    };
    Level.prototype.checkGraceCreating = function () {
        var diff = this.grace_trashold - this.kill_count;
        if (diff > 0)
            return;
        var exist = this.bindedEffects.some(function (elem) { return elem instanceof Grace_1.default; });
        if (exist) {
            this.grace_trashold++;
            return;
        }
        diff = Math.abs(diff);
        var chance = 20 + diff;
        if (chance >= Func_1.default.random()) {
            this.grace_trashold += this.grace_trashold;
            var portal = new Grace_1.default(this);
            while (portal.isOutOfMap()) {
                var random_player = this.players[Math.floor(Math.random() * this.players.length)];
                var angle = Math.random() * 6.28;
                var distance = Func_1.default.random(15, 30);
                portal.setPoint(random_player.x + Math.sin(angle) * distance, random_player.y + Math.cos(angle) * distance);
            }
            this.bindedEffects.push(portal);
        }
    };
    Level.prototype.collectTheDead = function () {
        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies[i];
            if (enemy.is_corpse) {
                this.kill_count++;
                this.checkGraceCreating();
                if (Func_1.default.chance(enemy.create_chance)) {
                    var drop_name = undefined;
                    var total_weights = enemy.getTotalWeights();
                    var sum = total_weights.reduce(function (acc, elem) { return elem[1] + acc; }, 0);
                    var w2 = 0;
                    var rnd = Math.random() * sum;
                    for (var _i = 0, total_weights_1 = total_weights; _i < total_weights_1.length; _i++) {
                        var item = total_weights_1[_i];
                        w2 += item[1];
                        if (rnd <= w2) {
                            drop_name = item[0];
                            break;
                        }
                    }
                    if (drop_name === 'grace') {
                        drop_name = new GraceShard_1.default(this);
                    }
                    else if (drop_name === 'energy') {
                        drop_name = new ChargedSphere_1.default(this);
                    }
                    else if (drop_name === 'entity') {
                        drop_name = new Split_1.default(this);
                    }
                    else if (drop_name === 'intervention') {
                        drop_name = new Intervention_1.default(this);
                    }
                    if (drop_name) {
                        drop_name.setPoint(enemy.x, enemy.y);
                        this.bindedEffects.push(drop_name);
                    }
                }
                var index = this.enemies.indexOf(enemy);
                this.enemies.splice(index, 1);
            }
        }
    };
    Level.enemy_list = [
        {
            'name': 'impy',
            'weight': 100
        },
        {
            'name': 'bones',
            'weight': 35
        },
        {
            'name': 'flamy',
            'weight': 25
        },
        {
            'name': 'solid',
            'weight': 15
        },
        {
            'name': 'flying bones',
            'weight': 12
        },
        {
            'name': 'pile',
            'weight': 10
        },
        {
            'name': 'specter',
            'weight': 5
        },
        {
            'name': 'gifter',
            'weight': 3
        },
    ];
    return Level;
}());
exports.default = Level;
