"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CharacterTemplate_1 = require("./Classes/CharacterTemplate");
var Client = /** @class */ (function () {
    function Client(id) {
        this.id = id;
        this.ready = false;
        this.template = new CharacterTemplate_1.default();
    }
    return Client;
}());
exports.default = Client;
