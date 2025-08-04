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
var GameObject_1 = require("../src/GameObject");
var Projectiles = /** @class */ (function (_super) {
    __extends(Projectiles, _super);
    function Projectiles(level) {
        var _this = _super.call(this, level) || this;
        _this.flipped = false;
        _this.light_r = 0;
        return _this;
    }
    Projectiles.prototype.setAngle = function (angle) {
        this.angle = angle;
    };
    Projectiles.prototype.setOwner = function (owner) {
        this.owner = owner;
    };
    Projectiles.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            name: this.name,
            z: this.z,
            flipped: this.flipped,
            light_r: this.light_r
        };
    };
    return Projectiles;
}(GameObject_1.default));
exports.default = Projectiles;
