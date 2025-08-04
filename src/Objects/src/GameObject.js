"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameObject = /** @class */ (function () {
    function GameObject(level, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.level = level;
        this.x = x;
        this.y = y;
        this.id = level.getId();
        this.name = 'object';
        this.move_speed = 0;
        this.box_r = 0;
        this.z = 0;
        this.light_r = 0;
        this.zone_id = 0;
    }
    GameObject.prototype.isOutOfMap = function (x, y) {
        if (x === void 0) { x = this.x; }
        if (y === void 0) { y = this.y; }
        if (this.zone_id === 0) {
            return x <= 10 || x >= 110 || y <= 20 || y > 120;
        }
        else if (this.zone_id === 1) {
            return x <= 165 || x >= 195 || y <= 40 || y > 70;
        }
        return false;
    };
    GameObject.prototype.getBoxElipse = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        return {
            x: this.x + x,
            y: this.y + y,
            r: this.box_r
        };
    };
    GameObject.prototype.setZone = function (zone_id, x, y) {
        this.zone_id = zone_id;
        this.x = x;
        this.y = y;
        this.level.socket.to(this.id).emit('change_level', this.zone_id);
    };
    GameObject.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    };
    GameObject.prototype.addToPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (!this.x || !this.y)
            return;
        this.x += x;
        this.y += y;
    };
    return GameObject;
}());
exports.default = GameObject;
