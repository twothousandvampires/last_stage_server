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
var Ability_1 = require("./../Ability");
var FlyerAbility = /** @class */ (function (_super) {
    __extends(FlyerAbility, _super);
    function FlyerAbility(owner) {
        var _this = _super.call(this, owner) || this;
        _this.owner = owner;
        _this.cost = 0;
        return _this;
    }
    return FlyerAbility;
}(Ability_1.default));
exports.default = FlyerAbility;
