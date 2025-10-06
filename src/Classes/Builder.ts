import Client from "../Client"
import ChargedArmour from "../Items/ChargedArmour"
import ChargedBow from "../Items/ChargedBow"
import Cloak from "../Items/Cloak"
import Crossbow from "../Items/Crossbow"
import CrystalGreaves from "../Items/CrystalGreaves"
import DaggerOfSmoke from "../Items/DaggerOfSmoke"
import DoomMantia from "../Items/DoomMantia"
import EmeraldKnife from "../Items/EmeraldKnife"
import FlameRing from "../Items/FlameRing"
import FlyingShards from "../Items/FlyingShards"
import Perception from "../Items/Forgings/Perception"
import ArmourRate from "../Items/Forgings/ArmourRate"
import AttackSpeed from "../Items/Forgings/AttackSpeed"
import BlockChance from "../Items/Forgings/BlockChance"
import BonesWhenBlock from "../Items/Forgings/BonesWhenBlock"
import CastSpeed from "../Items/Forgings/CastSpeed"
import Chance from "../Items/Forgings/Chance"
import Charisma from "../Items/Forgings/Charisma"
import CooldownReduction from "../Items/Forgings/CooldownReduction"
import Count from "../Items/Forgings/Count"
import Critical from "../Items/Forgings/Critical"
import Distance from "../Items/Forgings/Distance"
import DominanceWhenCritical from "../Items/Forgings/DominanceWhenCritical"
import Durability from "../Items/Forgings/Durability"
import Duration from "../Items/Forgings/Duration"
import FortifyWhenHit from "../Items/Forgings/FortifyWhenHit"
import Frequency from "../Items/Forgings/Frequency"
import GoldFind from "../Items/Forgings/GoldFind"
import IgniteWhenHit from "../Items/Forgings/IgniteWhenHit"
import Impact from "../Items/Forgings/Impact"
import InstantKill from "../Items/Forgings/InstantKill"
import Knowledge from "../Items/Forgings/Knowledge"
import MaxLIfe from "../Items/Forgings/MaxLIfe"
import MaxResource from "../Items/Forgings/MaxResource"
import Might from "../Items/Forgings/Might"
import NovaThenHit from "../Items/Forgings/NovaThenHit"
import Penetrating from "../Items/Forgings/Penetrating"
import Pierce from "../Items/Forgings/Pierce"
import Regen from "../Items/Forgings/Regen"
import Resist from "../Items/Forgings/Resist"
import Sacredness from "../Items/Forgings/Sacredness"
import ShockNovaWhenArmour from "../Items/Forgings/ShockNovaWhenArmour"
import StunWhenHit from "../Items/Forgings/StunWhenHit"
import Toughness from "../Items/Forgings/Toughness"
import Will from "../Items/Forgings/Will"
import GlacialChain from "../Items/GlacialChain"
import GlassSword from "../Items/GlassSword"
import IceBelt from "../Items/IceBelt"
import Item from "../Items/Item"
import MoltenHelm from "../Items/MoltenHelm"
import PaleBlade from "../Items/PaleBlade"
import RedPotion from "../Items/RedPotion"
import RingOfTransmutation from "../Items/RingOfTransmutation"
import RoyalMace from "../Items/RoyalMace"
import SearchingHeart from "../Items/SearchingHeart"
import SkullOfFirstWarrior from "../Items/SkullOfFirstWarrior"
import SolarSpear from "../Items/SolarSpear"
import SoulAccumulator from "../Items/SoulAccumulator"
import SoulBlade from "../Items/SoulBlade"
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
import Agility from "../Items/Forgings/Agility"
import Spirit from "../Items/Forgings/Spirit"
import FreezeWhenHited from "../Items/Forgings/FreezeWhenHited"
import LightningWhenUseSkill from "../Items/Forgings/LightningWhenUseSkill"
import DevouringAxe from "../Items/DevouringAxe"

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
        else if(item_name === 'searching heart'){
            return new SearchingHeart()
        }
        else if(item_name === 'charged armour'){
            return new ChargedArmour()
        }
        else if(item_name === 'molten helm'){
            return new MoltenHelm()
        }
        else if(item_name === 'soul blade'){
            return new SoulBlade()
        }
        else if(item_name === 'solar spear'){
            return new SolarSpear()
        }
        else if(item_name === 'crystal greaves'){
            return new CrystalGreaves()
        }
        else if(item_name === 'flying shards'){
            return new FlyingShards()
        }
        else if(item_name === 'pale blade'){
            return new PaleBlade()
        }
        else if(item_name === 'crossbow'){
            return new Crossbow()
        }
        else if(item_name === 'royal mace'){
            return new RoyalMace()
        } 
        else if(item_name === 'devouring axe'){
            return new DevouringAxe()
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
            case 'agility':
                return new Agility(item)
            case 'Perception':
                return new Perception(item)
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
            case 'cooldown reduction':
                return new CooldownReduction(item)
            case 'sacredness':
                return new Sacredness(item)
            case 'toughness':
                return new Toughness(item)
            case 'ignite when hit':
                return new IgniteWhenHit(item)
            case 'stun when hit':
                return new StunWhenHit(item)
            case 'shock nova when armour':
                return new ShockNovaWhenArmour(item)
            case 'bones when block':
                return new BonesWhenBlock(item)
            case 'instant kill':
                return new InstantKill(item)
            case 'charisma':
                return new Charisma(item)
            case 'when critical':
                return new DominanceWhenCritical(item)
            case 'when hit':
                return new FortifyWhenHit(item)
            case 'blessed life':
                return new MaxLIfe(item)
             case 'impact':
                return new Impact(item)
            case 'penetrating':
                return new Penetrating(item)
            case 'spirit':
                return new Spirit(item)
            case 'freeze when hited':
                return new FreezeWhenHited(item)
            case 'lightning when use skill':
                return new LightningWhenUseSkill(item)
            default:    
                return new NovaThenHit(item)
        }
    }
}