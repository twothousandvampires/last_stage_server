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
var CultistAbility_1 = require("./CultistAbility");
var Rune_1 = require("../../Objects/Effects/Rune");
var Func_1 = require("../../Func");
var Rune = /** @class */ (function (_super) {
    __extends(Rune, _super);
    function Rune(owner) {
        var _this = _super.call(this, owner) || this;
        _this.name = 'rune';
        _this.distance = 25;
        _this.runefield = false;
        _this.fast_detonation = false;
        _this.explosive = false;
        _this.second_detanation = false;
        _this.cd = false;
        return _this;
    }
    Rune.prototype.canUse = function () {
        return !this.cd && this.owner.can_cast;
    };
    Rune.prototype.use = function () {
        var _this = this;
        if (this.owner.is_attacking)
            return;
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
        this.owner.addMoveSpeedPenalty(-70);
        this.owner.stateAct = this.act;
        this.owner.action_time = 2000;
        this.owner.cancelAct = function () {
            _this.owner.action = false;
            _this.owner.addMoveSpeedPenalty(70);
            setTimeout(function () {
                _this.owner.hit = false;
                _this.owner.is_attacking = false;
                _this.owner.hit_x = undefined;
                _this.owner.hit_y = undefined;
            }, 50);
        };
        this.owner.setTimerToGetState(2000);
    };
    Rune.prototype.act = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rel_distance, distance, hit_x, hit_y, rune, count, zones, i, distance_x, distance_y, min_a, max_a, angle, x, y, rune_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.action && !this.hit)) return [3 /*break*/, 5];
                        this.hit = true;
                        rel_distance = Math.sqrt((Math.pow((this.x - this.c_x), 2)) + (Math.pow((this.y - this.c_y), 2)));
                        distance = rel_distance > this.first_ab.distance ? this.first_ab.distance : rel_distance;
                        this.level.sounds.push({
                            name: 'cast',
                            x: this.x,
                            y: this.y
                        });
                        hit_x = this.x + (Math.sin(this.attack_angle) * distance);
                        hit_y = this.y + (Math.cos(this.attack_angle) * distance);
                        rune = new Rune_1.default(this.level);
                        rune.fast_detonation = this.first_ab.fast_detonation;
                        rune.explosive = this.first_ab.explosive;
                        rune.second_detanation = this.first_ab.second_detanation;
                        rune.setOwner(this);
                        rune.setPoint(hit_x, hit_y);
                        this.level.bindedEffects.push(rune);
                        if (!this.first_ab.runefield) return [3 /*break*/, 5];
                        count = this.getSecondResource();
                        zones = 6.28 / count;
                        i = 1;
                        _a.label = 1;
                    case 1:
                        if (!(i <= count)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Func_1.default.sleep(300)];
                    case 2:
                        _a.sent();
                        distance_x = Func_1.default.random(5, 9);
                        distance_y = Func_1.default.random(5, 9);
                        min_a = (i - 1) * zones;
                        max_a = i * zones;
                        angle = Math.random() * (max_a - min_a) + min_a;
                        x = hit_x + (Math.sin(angle) * distance_x);
                        y = hit_y + (Math.cos(angle) * distance_y);
                        rune_1 = new Rune_1.default(this.level);
                        rune_1.fast_detonation = this.first_ab.fast_detonation;
                        rune_1.explosive = this.first_ab.explosive;
                        rune_1.second_detanation = this.first_ab.second_detanation;
                        rune_1.setOwner(this);
                        rune_1.setPoint(x, y);
                        this.level.bindedEffects.push(rune_1);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (count) {
                            this.first_ab.cd = true;
                            setTimeout(function () {
                                _this.first_ab.cd = false;
                            }, count * 2000);
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Rune;
}(CultistAbility_1.default));
exports.default = Rune;
