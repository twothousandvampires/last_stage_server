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
var GameObject_js_1 = require("../src/GameObject.js");
var Effect = /** @class */ (function (_super) {
    __extends(Effect, _super);
    function Effect(level) {
        return _super.call(this, level) || this;
    }
    Effect.prototype.act = function (time) {
    };
    Effect.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            name: this.name,
            z: this.z,
            light_r: this.light_r
        };
    };
    Effect.prototype.setOwner = function (owner) {
        this.owner = owner;
    };
    return Effect;
}(GameObject_js_1.default));
exports.default = Effect;
