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
var Character_1 = require("../Objects/src/Character");
var Status_1 = require("./Status");
var Drained = /** @class */ (function (_super) {
    __extends(Drained, _super);
    function Drained(time, duration) {
        var _this = _super.call(this, time, duration) || this;
        _this.time = time;
        _this.duration = duration;
        _this.might_drained = 0;
        _this.speed_drained = 0;
        _this.will_drained = 0;
        _this.knowledge_drained = 0;
        _this.agility_drained = 0;
        _this.durability_drained = 0;
        _this.name = 'drained';
        _this.need_to_check_resist = true;
        return _this;
    }
    Drained.prototype.drain = function () {
        if (this.unit.might > 0) {
            this.unit.might--;
            this.might_drained++;
        }
        if (this.unit.speed > 0) {
            this.unit.speed--;
            this.speed_drained++;
        }
        if (this.unit.will > 0) {
            this.unit.will--;
            this.will_drained++;
        }
        if (this.unit.knowledge > 0) {
            this.unit.knowledge--;
            this.knowledge_drained++;
        }
        if (this.unit.durability > 0) {
            this.unit.durability--;
            this.durability_drained++;
        }
        if (this.unit.agility > 0) {
            this.unit.agility--;
            this.agility_drained++;
        }
    };
    Drained.prototype.apply = function (unit) {
        this.unit = unit;
        if (this.unit instanceof Character_1.default) {
            this.unit.statusWasApplied();
            this.drain();
            this.unit.newStatus({
                name: 'drained',
                duration: this.duration,
                desc: 'your stats are decreased'
            });
        }
    };
    Drained.prototype.clear = function () {
        if (this.unit instanceof Character_1.default) {
            this.unit.might += this.might_drained;
            this.unit.speed += this.speed_drained;
            this.unit.durability += this.durability_drained;
            this.unit.agility += this.agility_drained;
            this.unit.will += this.will_drained;
            this.unit.knowledge += this.knowledge_drained;
        }
    };
    Drained.prototype.update = function (status) {
        this.time = Date.now();
        this.drain();
    };
    return Drained;
}(Status_1.default));
exports.default = Drained;
