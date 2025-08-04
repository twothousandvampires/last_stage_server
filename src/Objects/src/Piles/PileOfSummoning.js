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
var Func_1 = require("../../../Func");
var Bones_1 = require("../Enemy/Bones");
var Impy_1 = require("../Enemy/Impy");
var Pile_1 = require("./Pile");
var PileOfSummoning = /** @class */ (function (_super) {
    __extends(PileOfSummoning, _super);
    function PileOfSummoning(level) {
        var _this = _super.call(this, level) || this;
        _this.frequency = 4000;
        _this.getState();
        return _this;
    }
    PileOfSummoning.prototype.castAct = function () {
        if (this.action && !this.hit) {
            this.hit = true;
            this.level.sounds.push({
                name: 'cast',
                x: this.x,
                y: this.y
            });
            var enemy = Math.random() > 0.5 ? new Impy_1.default(this.level) : new Bones_1.default(this.level);
            while (enemy.isOutOfMap()) {
                var players_in_zone = this.level.players.filter(function (elem) { return elem.zone_id === 0; });
                var random_player = players_in_zone[Math.floor(Math.random() * players_in_zone.length)];
                var angle = Math.random() * 6.28;
                var distance_x = Func_1.default.random(5, 10);
                var distance_y = Func_1.default.random(5, 10);
                enemy.setPoint(random_player.x + Math.sin(angle) * distance_x, random_player.y + Math.cos(angle) * distance_y);
            }
            this.level.enemies.push(enemy);
        }
    };
    return PileOfSummoning;
}(Pile_1.default));
exports.default = PileOfSummoning;
