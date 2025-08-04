"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Status = /** @class */ (function () {
    function Status(time, duration) {
        this.time = time;
        this.duration = duration;
        this.last_checked = time;
        this.need_to_check_resist = false;
    }
    Status.prototype.checkResist = function (player) {
        if (!this.need_to_check_resist) {
            return false;
        }
        else {
            return player.isStatusResist();
        }
    };
    Status.prototype.isExpired = function (tick_time) {
        return tick_time - this.time >= this.duration;
    };
    Status.prototype.unitDead = function () {
    };
    Status.prototype.clear = function () {
    };
    Status.prototype.update = function (status) {
        this.time = Date.now();
    };
    Status.prototype.act = function (tick_time) {
    };
    return Status;
}());
exports.default = Status;
