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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Func_js_1 = require("../../Func.js");
var InfernoFlame_js_1 = require("../Projectiles/InfernoFlame.js");
var Effects_js_1 = require("./Effects.js");
var LightningBoltEffect_js_1 = require("./LightningBoltEffect.js");
var RocksFromCeil_js_1 = require("./RocksFromCeil.js");
var SmallShockNova_js_1 = require("./SmallShockNova.js");
var Intervention = /** @class */ (function (_super) {
    __extends(Intervention, _super);
    function Intervention(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'intervention';
        _this.box_r = 2;
        _this.time = Date.now();
        return _this;
    }
    Intervention.prototype.act = function (time) {
        var _this = this;
        if (time - this.time >= 10000) {
            this.level.deleted.push(this.id);
            this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem != _this; });
            return;
        }
        this.level.players.forEach(function (elem) {
            if (Func_js_1.default.elipseCollision(elem.getBoxElipse(), _this.getBoxElipse())) {
                if (elem.grace > 0) {
                    elem.grace--;
                }
                else {
                    elem.takePureDamage();
                }
                var r = Func_js_1.default.random(0, 2);
                if (r === 0) {
                    _this.activate(elem);
                }
                else if (r === 1) {
                    _this.activate2(elem);
                }
                else if (r === 2) {
                    _this.activate3(elem);
                }
                _this.level.deleted.push(_this.id);
                _this.level.bindedEffects = _this.level.bindedEffects.filter(function (elem) { return elem != _this; });
            }
        });
    };
    Intervention.prototype.activate3 = function (player) {
        var _this = this;
        var enemies = this.level.enemies;
        var players = this.level.players;
        players = players.filter(function (elem) { return elem != player; });
        var targets = enemies.concat(players);
        var hit = player.getBoxElipse();
        hit.r = 15;
        targets.forEach(function (elem) {
            if (!elem.is_dead && Func_js_1.default.elipseCollision(hit, elem.getBoxElipse())) {
                elem.takeDamage(undefined, {
                    explode: true
                });
                if (elem.is_dead) {
                    targets.forEach(function (elem2) {
                        var hit = elem.getBoxElipse();
                        hit.r = 15;
                        if (!elem.is_dead && Func_js_1.default.elipseCollision(hit, elem2.getBoxElipse())) {
                            elem2.takeDamage(undefined, {
                                explode: true
                            });
                            if (elem2.is_dead) {
                                targets.forEach(function (elem3) {
                                    var hit = elem2.getBoxElipse();
                                    hit.r = 15;
                                    if (!elem3.is_dead && Func_js_1.default.elipseCollision(hit, elem3.getBoxElipse())) {
                                        elem3.takeDamage(undefined, {
                                            explode: true
                                        });
                                    }
                                    var e = new SmallShockNova_js_1.default(_this.level);
                                    e.setPoint(elem2.x, elem2.y);
                                    _this.level.effects.push(e);
                                });
                                var e_1 = new SmallShockNova_js_1.default(_this.level);
                                e_1.setPoint(elem.x, elem.y);
                                _this.level.effects.push(e_1);
                            }
                        }
                    });
                    var e_2 = new SmallShockNova_js_1.default(_this.level);
                    e_2.setPoint(elem.x, elem.y);
                    _this.level.effects.push(e_2);
                }
            }
        });
        var e = new SmallShockNova_js_1.default(this.level);
        e.setPoint(player.x, player.y);
        this.level.effects.push(e);
    };
    Intervention.prototype.activate2 = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var i, flame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 20)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Func_js_1.default.sleep(80)];
                    case 2:
                        _a.sent();
                        flame = new InfernoFlame_js_1.InfernoFlame(this.level);
                        flame.setAngle(0);
                        flame.setPoint(player.x, player.y);
                        flame.setOwner(player);
                        this.level.projectiles.push(flame);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Intervention.prototype.activate = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var enemies, players, targets, _loop_1, this_1, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enemies = this.level.enemies;
                        players = this.level.players;
                        targets = enemies.concat(players);
                        _loop_1 = function (i) {
                            var add, distance_x, distance_y, angle, x, y, hiting_box, i_1, elem, l_effect;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, Func_js_1.default.sleep(150)];
                                    case 1:
                                        _b.sent();
                                        add = Math.round(i / 2);
                                        distance_x = Func_js_1.default.random(5, 10) + add;
                                        distance_y = Func_js_1.default.random(5, 10) + add;
                                        angle = Math.random() * 6.28;
                                        x = player.x + (Math.sin(angle) * distance_x);
                                        y = player.y + (Math.cos(angle) * distance_y);
                                        hiting_box = {
                                            x: x,
                                            y: y,
                                            r: 5
                                        };
                                        for (i_1 = 0; i_1 < targets.length; i_1++) {
                                            elem = targets[i_1];
                                            if (Func_js_1.default.elipseCollision(hiting_box, elem.getBoxElipse())) {
                                                elem.takeDamage(undefined, {
                                                    burn: true
                                                });
                                                break;
                                            }
                                        }
                                        l_effect = new LightningBoltEffect_js_1.default(this_1.level);
                                        l_effect.setPoint(x, y);
                                        this_1.level.addSound('lightning bolt', x, y);
                                        this_1.level.effects.push(l_effect);
                                        setTimeout(function () {
                                            var r_effect = new RocksFromCeil_js_1.default(_this.level);
                                            r_effect.setPoint(x, y);
                                            r_effect.setOwner(_this);
                                            _this.level.effects.push(r_effect);
                                        }, 400);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 50)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Intervention;
}(Effects_js_1.default));
exports.default = Intervention;
