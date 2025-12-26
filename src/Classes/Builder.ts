import Client from '../Client'
import ChargedArmour from '../Items/ChargedArmour'
import ChargedBow from '../Items/ChargedBow'
import Cloak from '../Items/Cloak'
import Crossbow from '../Items/Crossbow'
import CrystalGreaves from '../Items/CrystalGreaves'
import DaggerOfSmoke from '../Items/DaggerOfSmoke'
import DoomMantia from '../Items/DoomMantia'
import EmeraldKnife from '../Items/EmeraldKnife'
import FlameRing from '../Items/FlameRing'
import FlyingShards from '../Items/FlyingShards'
import Perception from '../Items/Forgings/Perception'
import ArmourRate from '../Items/Forgings/ArmourRate'
import AttackSpeed from '../Items/Forgings/AttackSpeed'
import BlockChance from '../Items/Forgings/BlockChance'
import BonesWhenBlock from '../Items/Forgings/BonesWhenBlock'
import CastSpeed from '../Items/Forgings/CastSpeed'
import Chance from '../Items/Forgings/Chance'
import Charisma from '../Items/Forgings/Charisma'
import CooldownReduction from '../Items/Forgings/CooldownReduction'
import Count from '../Items/Forgings/Count'
import Critical from '../Items/Forgings/Critical'
import Distance from '../Items/Forgings/Distance'
import DominanceWhenCritical from '../Items/Forgings/DominanceWhenCritical'
import Durability from '../Items/Forgings/Durability'
import Duration from '../Items/Forgings/Duration'
import FortifyWhenHit from '../Items/Forgings/FortifyWhenHit'
import Frequency from '../Items/Forgings/Frequency'
import GoldFind from '../Items/Forgings/GoldFind'
import IgniteWhenHit from '../Items/Forgings/IgniteWhenHit'
import Impact from '../Items/Forgings/Impact'
import InstantKill from '../Items/Forgings/InstantKill'
import Knowledge from '../Items/Forgings/Knowledge'
import MaxResource from '../Items/Forgings/MaxResource'
import Might from '../Items/Forgings/Might'
import NovaThenHit from '../Items/Forgings/NovaThenHit'
import Penetrating from '../Items/Forgings/Penetrating'
import Pierce from '../Items/Forgings/Pierce'
import Regen from '../Items/Forgings/Regen'
import Resist from '../Items/Forgings/Resist'
import Sacredness from '../Items/Forgings/Sacredness'
import ShockNovaWhenArmour from '../Items/Forgings/ShockNovaWhenArmour'
import StunWhenHit from '../Items/Forgings/StunWhenHit'
import Toughness from '../Items/Forgings/Toughness'
import Will from '../Items/Forgings/Will'
import GlacialChain from '../Items/GlacialChain'
import GlassSword from '../Items/GlassSword'
import IceBelt from '../Items/IceBelt'
import Item from '../Items/Item'
import MoltenHelm from '../Items/MoltenHelm'
import PaleBlade from '../Items/PaleBlade'
import RedPotion from '../Items/RedPotion'
import RingOfTransmutation from '../Items/RingOfTransmutation'
import RoyalMace from '../Items/RoyalMace'
import SearchingHeart from '../Items/SearchingHeart'
import SkullOfFirstWarrior from '../Items/SkullOfFirstWarrior'
import SolarSpear from '../Items/SolarSpear'
import SoulAccumulator from '../Items/SoulAccumulator'
import SoulBlade from '../Items/SoulBlade'
import SparklingHelmet from '../Items/SparklingHelmet'
import Staff from '../Items/Staff'
import SwordHandle from '../Items/SwordHandle'
import TwilightGloves from '../Items/TwilightGloves'
import WallOfBones from '../Items/WallOfBones'
import WhisperingShield from '../Items/WhisperingShield'
import WhiteShield from '../Items/WhiteShield'
import YellowStone from '../Items/YellowStone'
import Level from '../Level'
import Character from '../Objects/src/Character'
import Cultist from '../Objects/src/PlayerClasses/Cultist'
import Flyer from '../Objects/src/PlayerClasses/Flyer'
import Swordman from '../Objects/src/PlayerClasses/Swordman'
import Agility from '../Items/Forgings/Agility'
import Spirit from '../Items/Forgings/Spirit'
import FreezeWhenHited from '../Items/Forgings/FreezeWhenHited'
import LightningWhenUseSkill from '../Items/Forgings/LightningWhenUseSkill'
import DevouringAxe from '../Items/DevouringAxe'
import FrostShpereWhenKill from '../Items/Forgings/FrostShpereWhenKill'
import SparksWhenBlock from '../Items/Forgings/SparksWhenBlock'
import Overcharge from '../Items/Forgings/Overcharge'
import FlamyNimbus from '../Items/FlamyNimbus'
import IcePresence from '../Items/Forgings/IcePresence'
import ColdHeart from '../Items/Forgings/ColdHeart'
import ExplosiveArmour from '../Items/Forgings/ExplosiveArmour'
import ThunderStrikes from '../Items/Forgings/ThunderStrikes'
import FirePresence from '../Items/Forgings/FirePresence'
import StormPresence from '../Items/Forgings/StormPresence'
import WindBarrier from '../Glyphs/WindBarrier'
import VoidDevouring from '../Glyphs/VoidDevouring'
import Recovery from '../Glyphs/Recovery'
import Func from '../Func'
import FallingStones from '../Glyphs/FallingStones'
import WaveOfTransformation from '../Glyphs/WaveOfTransformation'
import HolyStrike from '../Glyphs/HolyStrike'
import TornadoLaunch from '../Glyphs/TornadoLaunch'
import Power from '../Items/Forgings/Power'
import InfernalGaze from '../Glyphs/InfernalGaze'
import SwirlingIce from '../Glyphs/SwirlingIce'
import LightningFury from '../Glyphs/LightningFury'
import FlyingSwords from '../Glyphs/FlyingSwords'
import Vampiric from '../Items/Forgings/Vampiric'
import Cleansing from '../Glyphs/Сleansing'
import Insight from '../Glyphs/Insight'
import Trinity from '../Glyphs/Trinity'
import TurtleShell from '../Glyphs/TurtleShell'
import Dismemberment from '../Glyphs/Dismemberment'
import Distorter from '../Items/Distorter'
import Echo from '../Items/Forgings/Echo'
import BlessedLife from '../Items/Forgings/BlessedLife'
import EnchantedArmour from '../Items/Forgings/EnchantedArmour'
import FragilityOnHit from '../Items/Forgings/FragilityOnHit'
import LightningSentries from '../Glyphs/LightningSentries'
import MaxLife from '../Items/Forgings/MaxLife'
import StoneSkin from '../Items/Forgings/StoneSkin'
import Thunder from '../Items/Forgings/Thunder'
import SpikedWeapon from '../Items/Forgings/SpikedWeapon'
import GoldenReplica from '../Items/Forgings/GoldenReplica'
import ShockWave from '../Items/Forgings/ShockWave'
import EnergyWeapon from '../Items/Forgings/EnergyWeapon'
import GiftOfEnlightment from '../Items/Forgings/GiftOfEnlightment'
import AscensionArmour from '../Items/Forgings/AscensionArmour'
import Crusher from '../Items/Crusher'

export default class Builder {
    static masteryMap = {
        'wind barrier': WindBarrier,
        'devouring void': VoidDevouring,
        recovery: Recovery,
        'falling stones': FallingStones,
        'wave of trasformation': WaveOfTransformation,
        'hole strike': HolyStrike,
        // 'tornado launch': TornadoLaunch,
        'infernal gaze': InfernalGaze,
        'swirling ice': SwirlingIce,
        'lightning fury': LightningFury,
        'flying sword': FlyingSwords,
        cleansing: Cleansing,
        insight: Insight,
        trinity: Trinity,
        'turtle shell': TurtleShell,
        dismemberment: Dismemberment,
        'lightning sentries': LightningSentries
    }

    static itemMap = {
        'skull of first warrior': SkullOfFirstWarrior,
        'glacial chain': GlacialChain,
        'red potion': RedPotion,
        'soul accumulator': SoulAccumulator,
        'doom mantia': DoomMantia,
        'wall of bones': WallOfBones,
        'flame ring': FlameRing,
        'sparkling helmet': SparklingHelmet,
        'glass sword': GlassSword,
        cloak: Cloak,
        staff: Staff,
        'charged bow': ChargedBow,
        'dagger of smoke': DaggerOfSmoke,
        'yellow stone': YellowStone,
        'white shield': WhiteShield,
        'emerald knife': EmeraldKnife,
        'whispering shield': WhisperingShield,
        'twilight gloves': TwilightGloves,
        'ring of transmutation': RingOfTransmutation,
        'sword handle': SwordHandle,
        'ice belt': IceBelt,
        'searching heart': SearchingHeart,
        'charged armour': ChargedArmour,
        'molten helm': MoltenHelm,
        'soul blade': SoulBlade,
        'solar spear': SolarSpear,
        'crystal greaves': CrystalGreaves,
        'flying shards': FlyingShards,
        'pale blade': PaleBlade,
        crossbow: Crossbow,
        'royal mace': RoyalMace,
        'devouring axe': DevouringAxe,
        'flamy nimbus': FlamyNimbus,
        distorter: Distorter,
        'crusher': Crusher
    }

    static greatForgingMap = {
        'max life': MaxLife,
        charisma: Charisma,
        'stone skin': StoneSkin,
        thunder: Thunder,
        'spiked weapon': SpikedWeapon,
        'golden replica': GoldenReplica,
        echo: Echo,
        'shock wave': ShockWave
    }

    static forgingMap = {
        'attack speed': AttackSpeed,
        'armour rate': ArmourRate,
        'block chance': BlockChance,
        'bones when block': BonesWhenBlock,
        'cast speed': CastSpeed,
        chance: Chance,
        'cooldown reduction': CooldownReduction,
        count: Count,
        critical: Critical,
        distance: Distance,
        'dominance when critical': DominanceWhenCritical,
        durability: Durability,
        duration: Duration,
        'fortify when hit': FortifyWhenHit,
        frequency: Frequency,
        'gold find': GoldFind,
        'ignite when hit': IgniteWhenHit,
        impact: Impact,
        'instant kill': InstantKill,
        knowledge: Knowledge,
        'max resources': MaxResource,
        might: Might,
        'nova when hit': NovaThenHit,
        penetrating: Penetrating,
        pierce: Pierce,
        'regen time': Regen,
        resist: Resist,
        'soul pulling': Sacredness,
        'shock nova when armour': ShockNovaWhenArmour,
        'stun when hit': StunWhenHit,
        toughness: Toughness,
        will: Will,
        agility: Agility,
        spirit: Spirit,
        'freeze when hited': FreezeWhenHited,
        'lightning when use skill': LightningWhenUseSkill,
        'frost shpere when kill': FrostShpereWhenKill,
        'sparks when block': SparksWhenBlock,
        overcharge: Overcharge,
        perception: Perception,
        'ice presence': IcePresence,
        'cold heart': ColdHeart,
        'explosive armour': ExplosiveArmour,
        'thunder strikes': ThunderStrikes,
        'fire presence': FirePresence,
        'storm presence': StormPresence,
        power: Power,
        vampiric: Vampiric,
        'blessed life': BlessedLife,
        'enchanted armour': EnchantedArmour,
        'fragility on hit': FragilityOnHit,
        'energy weapon': EnergyWeapon,
        'gift of enlightenment': GiftOfEnlightment,
        'ascension armor': AscensionArmour
    }

    static createCharacter(client: Client, level: Level): Character {
        let template = client.template
        let character = undefined

        if (template.name === 'swordman') {
            character = new Swordman(level)
        } else if (template.name === 'flyer') {
            character = new Flyer(level)
        } else if (template.name === 'cultist') {
            character = new Cultist(level)
        } else {
            character = new Swordman(level)
        }

        character.id = client.id
        character.applyStats(template.stats)
        character.createAbilities(template.abilities)

        if (template.item.length) {
            template.item.forEach(elem => {
                character.item.push(elem)
            })
        }

        character.setPoint(0, 0)
        return character
    }

    static createItem(item_name: string): Item {
        let ItemClass = Builder.itemMap[item_name.toLowerCase()]

        if (ItemClass) {
            return new ItemClass()
        } else {
            return new GlacialChain()
        }
    }

    static createMastery(name: string) {
        let item_class = Builder.masteryMap[name.toLowerCase()]

        if (item_class) {
            return new item_class()
        } else {
            return new WindBarrier()
        }
    }

    static createRandomMastery() {
        let name = Func.getRandomFromArray(Array.from(Object.keys(Builder.masteryMap)))

        return Builder.createMastery(name)
    }

    static createForging(name: string, item: Item) {
        let ItemClass = Builder.forgingMap[name.toLowerCase()]

        if (ItemClass) {
            return new ItemClass(item)
        } else {
            return new ArmourRate(item)
        }
    }

    static createGreatForging(name: string, item: Item | undefined) {
        console.log(name)
        let ItemClass = Builder.greatForgingMap[name.toLowerCase()]

        if (ItemClass) {
            return new ItemClass(item)
        } else {
            return new MaxLife(item)
        }
    }
}
