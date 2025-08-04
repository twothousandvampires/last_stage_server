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
exports.SpecterSoulSeeker = void 0;
var Func_js_1 = require("../../Func.js");
var Drained_js_1 = require("../../Status/Drained.js");
var Projectiles_js_1 = require("./Projectiles.js");
var SpecterSoulSeeker = /** @class */ (function (_super) {
    __extends(SpecterSoulSeeker, _super);
    function SpecterSoulSeeker(level) {
        var _this = _super.call(this, level) || this;
        _this.box_r = 0.4;
        _this.name = 'specter soul seeker';
        _this.move_speed = 0.3;
        _this.w = 3;
        _this.max_distance = 35;
        return _this;
    }
    SpecterSoulSeeker.prototype.setPoint = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
    };
    SpecterSoulSeeker.prototype.act = function () {
        var _this = this;
        this.level.players.forEach(function (elem) {
            var _a, _b, _c;
            if (Func_js_1.default.elipseCollision(_this.getBoxElipse(), elem.getBoxElipse())) {
                var status_1 = new Drained_js_1.default(elem.time, 6000);
                _this.level.setStatus(elem, status_1);
                (_a = _this.owner) === null || _a === void 0 ? void 0 : _a.move_speed += 0.1;
                if (((_b = _this.owner) === null || _b === void 0 ? void 0 : _b.attack_speed) > 800) {
                    (_c = _this.owner) === null || _c === void 0 ? void 0 : _c.attack_speed -= 100;
                }
                _this.impact();
            }
        });
        if (this.isOutOfMap()) {
            this.impact();
            return;
        }
        var traveled = Math.sqrt((Math.pow((this.x - this.start_x), 2)) + (Math.pow((this.y - this.start_y), 2)));
        if (traveled >= this.max_distance) {
            this.impact();
            return;
        }
        if (!this.target) {
            this.target = this.level.players.filter(function (elem) { return Func_js_1.default.distance(_this, elem) <= 8; })[0];
        }
        if (this.target) {
            this.angle = Func_js_1.default.angle(this.x, this.y, this.target.x, this.target.y);
        }
        var l = 1 - Math.abs(0.5 * Math.cos(this.angle));
        var n_x = Math.sin(this.angle) * l;
        var n_y = Math.cos(this.angle) * l;
        n_x *= this.move_speed;
        n_y *= this.move_speed;
        if (n_x < 0) {
            this.flipped = true;
        }
        else {
            this.flipped = false;
        }
        this.addToPoint(n_x, n_y);
    };
    SpecterSoulSeeker.prototype.impact = function () {
        var _this = this;
        this.level.deleted.push(this.id);
        this.level.projectiles = this.level.projectiles.filter(function (elem) { return elem != _this; });
    };
    return SpecterSoulSeeker;
}(Projectiles_js_1.default));
exports.SpecterSoulSeeker = SpecterSoulSeeker;
