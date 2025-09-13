import Client from "../Client"
import ChargedBow from "../Items/ChargedBow"
import Cloak from "../Items/Cloak"
import DaggerOfSmoke from "../Items/DaggerOfSmoke"
import DoomMantia from "../Items/DoomMantia"
import EmeraldKnife from "../Items/EmeraldKnife"
import FlameRing from "../Items/FlameRing"
import Agility from "../Items/Forgings/Agility"
import ArmourRate from "../Items/Forgings/ArmourRate"
import AttackSpeed from "../Items/Forgings/AttackSpeed"
import BlockChance from "../Items/Forgings/BlockChance"
import CastSpeed from "../Items/Forgings/CastSpeed"
import Chance from "../Items/Forgings/Chance"
import Count from "../Items/Forgings/Count"
import Critical from "../Items/Forgings/Critical"
import Distance from "../Items/Forgings/Distance"
import Durability from "../Items/Forgings/Durability"
import Duration from "../Items/Forgings/Duration"
import Frequency from "../Items/Forgings/Frequency"
import GoldFind from "../Items/Forgings/GoldFind"
import Knowledge from "../Items/Forgings/Knowledge"
import MaxResource from "../Items/Forgings/MaxResource"
import Might from "../Items/Forgings/Might"
import NovaThenHit from "../Items/Forgings/NovaThenHit"
import Pierce from "../Items/Forgings/Pierce"
import Regen from "../Items/Forgings/Regen"
import Resist from "../Items/Forgings/Resist"
import Speed from "../Items/Forgings/Speed"
import Will from "../Items/Forgings/Will"
import GlacialChain from "../Items/GlacialChain"
import GlassSword from "../Items/GlassSword"
import IceBelt from "../Items/IceBelt"
import Item from "../Items/Item"
import RedPotion from "../Items/RedPotion"
import RingOfTransmutation from "../Items/RingOfTransmutation"
import SkullOfFirstWarrior from "../Items/SkullOfFirstWarrior"
import SoulAccumulator from "../Items/SoulAccumulator"
import SparklingHelmet from "../Items/SparklingHelmet"
import Staff from "../Items/Staff"
import SwordHandle from "../Items/SwordHandle"
import TwilightGloves from "../Items/TwilightGloves"
import WallOfBones from "../Items/WallOfBones"
import WhisperingShield from "../Items/WhisperingShield"
import WhiteShield from "../Items/WhiteShield"
import YellowStone from "../Items/YellowStone"
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

        if(template.item.length){
            template.item.forEach(elem => {
                character.item.push(elem)
            })
        }

        character.setPoint(0, 0)
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
        else if(item_name === 'cloak'){
            return new Cloak()
        }
        else if(item_name === 'staff'){
            return new Staff()
        }
        else if(item_name === 'charged bow'){
            return new ChargedBow()
        }
        else if(item_name === 'dagger of smoke'){
            return new DaggerOfSmoke()
        }
        else if(item_name === 'yellow stone'){
            return new YellowStone()
        }
        else if(item_name === 'white shield'){
            return new WhiteShield()
        }
        else if(item_name === 'emerald knife'){
            return new EmeraldKnife()
        }
        else if(item_name === 'whispering shield'){
            return new WhisperingShield()
        }
        else if(item_name === 'twilight gloves'){
            return new TwilightGloves()
        }
        else if(item_name === 'ring of transmutation'){
            return new RingOfTransmutation()
        }
        else if(item_name === 'sword handle'){
            return new SwordHandle()
        }
        else if(item_name === 'ice belt'){
            return new IceBelt()
        }
    }

    static createForging(name: string, item: Item){
        switch (name){
            case 'critical':
                return new Critical(item)
            case 'pierce':
                return new Pierce(item)
            case 'attack speed':
                return new AttackSpeed(item)
            case 'armour rate':
                return new ArmourRate(item)
            case 'nova when hit':
                return new NovaThenHit(item)
            case 'resist':
                return new Resist(item)
            case 'will':
                return new Will(item)
            case 'knowledge':
                return new Knowledge(item)
            case 'speed':
                return new Speed(item)
            case 'agility':
                return new Agility(item)
            case 'might':
                return new Might(item)
            case 'durability':
                return new Durability(item)
            case 'max resources':
                return new MaxResource(item)
            case 'regen time':
                return new Regen(item)
            case 'cast speed':
                return new CastSpeed(item)
            case 'block chance':
                return new BlockChance(item)
            case 'gold find':
                return new GoldFind(item)
            case 'chance':
                return new Chance(item)
            case 'distance':
                return new Distance(item)
            case 'count':
                return new Count(item)
            case 'duration':
                return new Duration(item)
            case 'frequency':
                return new Frequency(item)

            default:    
                return new NovaThenHit(item)
        }
    }
}