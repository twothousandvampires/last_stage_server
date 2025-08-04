"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DoomMantia_1 = require("../Items/DoomMantia");
var FlameRing_1 = require("../Items/FlameRing");
var GlacialChain_1 = require("../Items/GlacialChain");
var RedPotion_1 = require("../Items/RedPotion");
var SkullOfFirstWarrior_1 = require("../Items/SkullOfFirstWarrior");
var SoulAccumulator_1 = require("../Items/SoulAccumulator");
var SparklingHelmet_1 = require("../Items/SparklingHelmet");
var WallOfBones_1 = require("../Items/WallOfBones");
var Cultist_1 = require("../Objects/src/PlayerClasses/Cultist");
var Flyer_1 = require("../Objects/src/PlayerClasses/Flyer");
var Swordman_1 = require("../Objects/src/PlayerClasses/Swordman");
var Builder = /** @class */ (function () {
    function Builder() {
    }
    Builder.createCharacter = function (client, level) {
        var template = client.template;
        var character = undefined;
        if (template.name === 'swordman') {
            character = new Swordman_1.default(level);
        }
        else if (template.name === 'flyer') {
            character = new Flyer_1.default(level);
        }
        else if (template.name === 'cultist') {
            character = new Cultist_1.default(level);
        }
        else {
            character = new Swordman_1.default(level);
        }
        character.id = client.id;
        character.applyStats(template.stats);
        character.createAbilities(template.abilities);
        if (template.item) {
            character.createItem(template.item);
        }
        character.setPoint(60, 60);
        return character;
    };
    Builder.createItem = function (item_name) {
        if (item_name === 'skull of first warrior') {
            return new SkullOfFirstWarrior_1.default();
        }
        else if (item_name === 'glacial chain') {
            return new GlacialChain_1.default();
        }
        else if (item_name === 'red potion') {
            return new RedPotion_1.default();
        }
        else if (item_name === 'soul accumulator') {
            return new SoulAccumulator_1.default();
        }
        else if (item_name === 'doom mantia') {
            return new DoomMantia_1.default();
        }
        else if (item_name === 'wall of bones') {
            return new WallOfBones_1.default();
        }
        else if (item_name === 'flame ring') {
            return new FlameRing_1.default();
        }
        else if (item_name === 'sparkling helmet') {
            return new SparklingHelmet_1.default();
        }
    };
    return Builder;
}());
exports.default = Builder;
