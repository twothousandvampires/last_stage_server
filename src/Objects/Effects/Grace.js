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
var Func_js_1 = require("../../Func.js");
var TimeStoped_js_1 = require("../../Status/TimeStoped.js");
var Effects_js_1 = require("./Effects.js");
var Star_js_1 = require("./Star.js");
var Teacher_js_1 = require("./Teacher.js");
var Grace = /** @class */ (function (_super) {
    __extends(Grace, _super);
    function Grace(level) {
        var _this = _super.call(this, level) || this;
        _this.name = 'grace';
        _this.time = Date.now();
        _this.box_r = 2;
        _this.gatedPlayers = [];
        _this.not_deserving = [];
        return _this;
    }
    Grace.prototype.act = function (time) {
        var _this = this;
        if (time - this.time >= 15000) {
            this.closeGate();
            this.level.deleted.push(this.id);
            this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem != _this; });
            return;
        }
        this.level.players.forEach(function (elem) {
            if (Func_js_1.default.elipseCollision(elem.getBoxElipse(), _this.getBoxElipse())) {
                if (elem.grace <= 0 && !_this.not_deserving.includes(elem.id)) {
                    _this.level.addSound('not deserving', elem.x, elem.y);
                    _this.not_deserving.push(elem.id);
                }
                else if (elem.grace > 0) {
                    if (_this.gatedPlayers.length === 0) {
                        _this.generateEffects();
                    }
                    _this.gatedPlayers.push({
                        x: elem.x,
                        y: elem.y,
                        player: elem
                    });
                    var status_1 = new TimeStoped_js_1.default(elem.time, 15000 - (time - _this.time));
                    _this.level.setStatus(elem, status_1);
                    elem.setZone(1, 180, 60);
                    elem.light_r = 32;
                    _this.time += 5000;
                }
            }
        });
    };
    Grace.prototype.closeGate = function () {
        this.gatedPlayers.forEach(function (player_data) {
            player_data.player.light_r = 16;
            player_data.player.removeUpgrades();
            player_data.player.closeUpgrades();
            player_data.player.setZone(0, player_data.x, player_data.y);
            player_data.player.can_generate_upgrades = true;
        });
        this.deleteEffects();
    };
    Grace.prototype.generateEffects = function () {
        var teacher = new Teacher_js_1.default(this.level);
        this.level.bindedEffects.push(teacher);
        var stars_count = 60;
        var centr_x = 180;
        var centr_y = 60;
        for (var i = 0; i < stars_count; i++) {
            var angle = Math.random() * 6.28;
            var star = new Star_js_1.default(this.level);
            star.setZone(1, Math.round(centr_x + Math.sin(angle) * Func_js_1.default.random(12, 80)), Math.round(centr_y + Math.cos(angle) * Func_js_1.default.random(12, 80)));
            this.level.bindedEffects.push(star);
        }
    };
    Grace.prototype.deleteEffects = function () {
        var _this = this;
        var to_delete = this.level.bindedEffects.filter(function (elem) { return elem.zone_id === 1; });
        to_delete.forEach(function (elem) {
            _this.level.deleted.push(elem.id);
        });
        this.level.bindedEffects = this.level.bindedEffects.filter(function (elem) { return elem.zone_id != 1; });
    };
    return Grace;
}(Effects_js_1.default));
exports.default = Grace;
