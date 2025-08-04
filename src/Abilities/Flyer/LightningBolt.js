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
var Func_1 = require("../../Func");
var LightningBoltEffect_1 = require("../../Objects/Effects/LightningBoltEffect");
var RocksFromCeil_1 = require("../../Objects/Effects/RocksFromCeil");
var ShockStatus_1 = require("../../Status/ShockStatus");
var FlyerAbility_1 = require("./FlyerAbility");
var LightningBolt = /** @class */ (function (_super) {
    __extends(LightningBolt, _super);
    function LightningBolt(owner) {
        var _this = _super.call(this, owner) || this;
        _this.cost = 1;
        _this.name = 'lightning bolt';
        _this.high_voltage = false;
        _this.storm = false;
        return _this;
    }
    LightningBolt.prototype.canUse = function () {
        return this.owner.resource >= this.cost;
    };
    LightningBolt.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
        this.owner.pay_to_cost = this.cost;
        var rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40);
        var rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40);
        this.owner.c_x = rel_x;
        this.owner.c_y = rel_y;
        if (rel_x < this.owner.x) {
            this.owner.flipped = true;
        }
        else {
            this.owner.flipped = false;
        }
        this.owner.attack_angle = Func_1.default.angle(this.owner.x, this.owner.y, rel_x, rel_y);
        this.owner.is_attacking = true;
        this.owner.state = 'cast';
        var move_speed_reduce = this.owner.getMoveSpeedPenaltyValue();
        this.owner.addMoveSpeedPenalty(-move_speed_reduce);
        this.owner.stateAct = this.act;
        var cast_speed = this.owner.getCastSpeed();
        this.owner.action_time = cast_speed;
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.addMoveSpeedPenalty(move_speed_reduce);
            setTimeout(function () {
                _this.owner.hit = false;
                _this.owner.is_attacking = false;
            }, 50);
        };
        this.owner.setTimerToGetState(cast_speed);
    };
    LightningBolt.prototype.act = function () {
        return __awaiter(this, void 0, void 0, function () {
            var t, enemies, players, targets, hiting_box, high_voltage, max_targets, time, i, elem, status_1, l_effect, storm, _loop_1, this_1, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.action && !this.hit)) return [3 /*break*/, 4];
                        this.payCost();
                        this.hit = true;
                        if (this.target) {
                            t = this.level.enemies.find(function (elem) { return elem.id === _this.target; });
                            if (!t) {
                                t = this.level.players.find(function (elem) { return elem.id === _this.target; });
                            }
                            if (t) {
                                this.c_x = Math.floor(t.x);
                                this.c_y = Math.floor(t.y);
                            }
                        }
                        enemies = this.level.enemies;
                        players = this.level.players;
                        targets = enemies.concat(players);
                        hiting_box = {
                            x: this.c_x,
                            y: this.c_y,
                            r: 4 + Math.round(this.getAdditionalRadius())
                        };
                        high_voltage = this.first_ab.high_voltage;
                        max_targets = high_voltage ? 3 : 1;
                        time = Date.now();
                        for (i = 0; i < targets.length; i++) {
                            elem = targets[i];
                            if (Func_1.default.elipseCollision(hiting_box, elem.getBoxElipse())) {
                                if (!high_voltage && max_targets === 0) {
                                    status_1 = new ShockStatus_1.default(time, 5000, 20);
                                    this.level.setStatus(elem, status_1);
                                }
                                else if (max_targets > 0) {
                                    max_targets--;
                                    this.succesefulHit();
                                    elem.takeDamage(this, {
                                        burn: true
                                    });
                                }
                            }
                        }
                        l_effect = new LightningBoltEffect_1.default(this.level);
                        l_effect.setPoint(this.c_x, this.c_y);
                        this.level.addSound('lightning bolt', this.c_x, this.c_y);
                        this.level.effects.push(l_effect);
                        this.target = undefined;
                        setTimeout(function () {
                            var r_effect = new RocksFromCeil_1.default(_this.level);
                            r_effect.setPoint(_this.c_x, _this.c_y);
                            r_effect.setOwner(_this);
                            _this.level.effects.push(r_effect);
                        }, 400);
                        storm = this.first_ab.storm;
                        if (!storm) return [3 /*break*/, 4];
                        _loop_1 = function (i) {
                            var distance_x, distance_y, angle, x, y, hiting_box_1, max_targets_1, i_1, elem, status_2, l_effect_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, Func_1.default.sleep(200)];
                                    case 1:
                                        _b.sent();
                                        distance_x = Func_1.default.random(5, 10);
                                        distance_y = Func_1.default.random(5, 10);
                                        angle = Math.random() * 6.28;
                                        x = this_1.c_x + (Math.sin(angle) * distance_x);
                                        y = this_1.c_y + (Math.cos(angle) * distance_y);
                                        hiting_box_1 = {
                                            x: x,
                                            y: y,
                                            r: 4 + Math.round(this_1.getAdditionalRadius())
                                        };
                                        max_targets_1 = high_voltage ? 3 : 1;
                                        for (i_1 = 0; i_1 < targets.length; i_1++) {
                                            elem = targets[i_1];
                                            if (Func_1.default.elipseCollision(hiting_box_1, elem.getBoxElipse())) {
                                                if (!high_voltage && max_targets_1 === 0) {
                                                    status_2 = new ShockStatus_1.default(time, 5000, 20);
                                                    this_1.level.setStatus(elem, status_2);
                                                }
                                                else if (max_targets_1 > 0) {
                                                    max_targets_1--;
                                                    this_1.succesefulHit();
                                                    elem.takeDamage(this_1, {
                                                        burn: true
                                                    });
                                                }
                                            }
                                        }
                                        l_effect_1 = new LightningBoltEffect_1.default(this_1.level);
                                        l_effect_1.setPoint(x, y);
                                        this_1.level.addSound('lightning bolt', x, y);
                                        this_1.level.effects.push(l_effect_1);
                                        setTimeout(function () {
                                            var r_effect = new RocksFromCeil_1.default(_this.level);
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
                        if (!(i < 2)) return [3 /*break*/, 4];
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
    return LightningBolt;
}(FlyerAbility_1.default));
exports.default = LightningBolt;
