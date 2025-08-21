import Client from "../Client"
import DoomMantia from "../Items/DoomMantia"
import FlameRing from "../Items/FlameRing"
import GlacialChain from "../Items/GlacialChain"
import GlassSword from "../Items/GlassSword"
import Item from "../Items/Item"
import RedPotion from "../Items/RedPotion"
import SkullOfFirstWarrior from "../Items/SkullOfFirstWarrior"
import SoulAccumulator from "../Items/SoulAccumulator"
import SparklingHelmet from "../Items/SparklingHelmet"
import WallOfBones from "../Items/WallOfBones"
import Level from "../Level"
import Character from "../Objects/src/Character"
import Cultist from "../Objects/src/PlayerClasses/Cultist"
import Flyer from "../Objects/src/PlayerClasses/Flyer"
import Swordman from "../Objects/src/PlayerClasses/Swordman"

export default class Builder{
    static createCharacter(client: Client, level: Level): Character{
        let template = client.template
        let character = undefined

        if(template.name === 'swordman'){
            character = new Swordman(level)
        }
        else if(template.name === 'flyer'){
            character = new Flyer(level)
        }
        else if(template.name === 'cultist'){
            character = new Cultist(level)
        }
        else{
            character = new Swordman(level)
        }   

        character.id = client.id
        character.applyStats(template.stats)
        character.createAbilities(template.abilities)
        if(template.item){
            character.createItem(template.item)
        }
        character.setPoint(88, 22)
        return character
    }

    static createItem(item_name: string): Item{
        if(item_name === 'skull of first warrior'){
            return new SkullOfFirstWarrior()
        }
        else if(item_name === 'glacial chain'){
            return new GlacialChain()
        }
        else if(item_name === 'red potion'){
            return new RedPotion()
        }
        else if(item_name === 'soul accumulator'){
            return new SoulAccumulator()
        }
        else if(item_name === 'doom mantia'){
            return new DoomMantia()
        }
        else if(item_name === 'wall of bones'){
            return new WallOfBones()
        }
        else if(item_name === 'flame ring'){
            return new FlameRing()
        }
        else if(item_name === 'sparkling helmet'){
            return new SparklingHelmet()
        }
        else if(item_name === 'glass sword'){
            return new GlassSword()
        }
    }
}