import Character from "../Objects/src/Character"
import Upgrade from "../Types/Upgrade"
import Touch from "../Status/Touch"
import WithColdStatus from "../Status/WithColdStatus"
import WithFireStatus from "../Status/WithFireStatus"
import WithStormStatus from "../Status/WithStormStatus"
import BlessedArmour from "../Status/BlessedArmour"
import Func from "../Func"
import CallWarriorWhenBlock from "../Triggers/CallWarriorWhenBlock";
import SoulShatter from "../Abilities/Cultist/SoulShatter";
import BurningCircle from "../Abilities/Cultist/BurningCircle";
import Rune from "../Abilities/Cultist/Rune"
import Cultist from "../Objects/src/PlayerClasses/Cultist"
import Slam from "../Abilities/Cultist/Slam"
import ShieldBash from "../Abilities/Cultist/ShieldBash"
import GrimPile from "../Abilities/Cultist/GrimPile"
import UnleashPain from "../Abilities/Cultist/UnleashPain"
import PileOfThornCast from "../Abilities/Cultist/PileOfThornCast"
import SelfFlagellation from "../Abilities/Cultist/SelfFlagellation"
import GhostForm from "../Abilities/Cultist/GhostForm"
import AnnihilatorBeam from "../Abilities/Flyer/AnnihilatorBeam";
import Teeth from "../Abilities/Flyer/Teeth";
import FlameWall from "../Abilities/Flyer/FlameWall"
import Flyer from "../Objects/src/PlayerClasses/Flyer"
import Fireball from "../Abilities/Flyer/Fireball"
import FrostSphere from "../Abilities/Flyer/FrostSphere"
import LightningBolt from "../Abilities/Flyer/LightningBolt"
import ForkedLightning from "../Abilities/Flyer/ForkedLightning"
import LightBeacon from "../Abilities/Flyer/LightBeacon"
import Frostnova from "../Abilities/Flyer/Frostnova"
import StaticField from "../Abilities/Flyer/StaticField"
import Teleportation from "../Abilities/Flyer/Teleportation"
import Sparks from "../Abilities/Flyer/Sparks"
import ShatteredWeapon from "../Abilities/Swordman/ShatteredWeapon";
import BlockingTechnique from "../Triggers/ BlockingTechnique";
import HeavenVengeance from "../Abilities/Swordman/HeavenVengeance";
import EmergencyOrdersTrigger from "../Triggers/EmergencyOrdersTrigger";
import WeaponSwing from "../Abilities/Swordman/WeaponSwing"
import WeaponThrow from "../Abilities/Swordman/WeaponThrow"
import Jump from "../Abilities/Swordman/Jump"
import Charge from "../Abilities/Swordman/Charge"
import Whirlwind from "../Abilities/Swordman/Whirlwind"
import Quake from "../Abilities/Swordman/Quake"
import CursedWeapon from "../Abilities/Swordman/CursedWeapon"
import Commands from "../Abilities/Swordman/Commands"
import Swordman from "../Objects/src/PlayerClasses/Swordman"
import MetalThorns from "../Abilities/Swordman/MetalThorns"
import Dash from "../Abilities/Swordman/Dash"
import SpectralSwords from "../Abilities/Swordman/SpectralSwords"
import Soulrender from "../Abilities/Cultist/Soulrender"
import Redemption from "../Status/Redemption"
import FleshHarvest from "../Status/FleshHarvest"
import WardAfterEnlightTrigger from "../Triggers/WardAfterEnlightTrigger"
import DivineWeaponTrigger from "../Triggers/DivineWeaponTrigger"
import UnhumanFortitudeTrigger from "../Triggers/UnhumanFortitudeTrigger"
import MassiveImpactTrigger from "../Triggers/MassiveImpactTrigger"
import InspirationTrigger from "../Triggers/InspirationTrigger"
import Creator from "../Status/Creator"
import DamageInRadiusWhenEnlightnent from "../Triggers/DamageInRadiusWhenEnlightnent"
import InnerPowerTrigger from "../Triggers/InnerPowerTrigger"
import Luck from "../Status/Luck"

export default class Upgrades{
    static getAllUpgrades(): Upgrade[]{
        return [
                {
                    name: 'overflow',
                    canUse: (character: Character) => {
                        return !character.triggers_on_enlight.some(elem => elem instanceof DamageInRadiusWhenEnlightnent)
                    },
                    teach: (character: Character): void => {
                        character.triggers_on_enlight.push(new DamageInRadiusWhenEnlightnent())
                    },
                    cost: 3,
                    ascend: 14,
                    desc: 'when you get enlightenment you deal damage in big radius'
                    },
                    {
                    name: 'way of enlightenment',
                    canUse: (character: Character) => {
                        return character.enlightenment_threshold >= 6
                    },
                    teach: (character: Character): void => {
                        character.enlightenment_threshold --
                    },
                    cost: 3,
                    ascend: 14,
                    desc: 'reduces amount of courage to get enlightenment'
                },
                {
                    name: 'creator of matter',
                    canUse: (character: Character) => {
                        return !character.level.status_pull.find(elem => elem.unit === character && elem instanceof Creator)
                    },
                    teach: (character: Character): void => {
                        character.level.setStatus(character, new Creator(character.level.time))
                    },
                    cost: 4,
                    ascend: 26,
                    desc: 'you can create a sphere around you'
                },
                {
                    name: 'luck',
                    canUse: (character: Character) => {
                        return !character.is_lucky
                    },
                    teach: (character: Character): void => {
                        let status = new Luck(character.level.time)
                        status.setDuration(30000)
                        character.after_grace_statuses.push(status)
                    },
                    cost: 2,
                    ascend: 12,
                    desc: 'you become lucky for 30 seconds'
                },
                {
                    name: 'focus',
                    canUse: (character: Character) => {
                        return character.courage_expire_timer <= 15000
                    },
                    teach: (character: Character): void => {
                        character.courage_expire_timer += 2000
                    },
                    cost: 4,
                    ascend: 10,
                    desc: 'your courage expires slower'
                },
                {
                    name: 'inspiration',
                    canUse: (character: Character) => {
                        return !character.triggers_on_get_energy.some(elem => elem instanceof InspirationTrigger)
                    },
                    teach: (character: Character): void => {
                        character.triggers_on_get_energy.push(new InspirationTrigger())
                    },
                    cost: 6,
                    ascend: 20,
                    desc: 'gives a chance depending on your perception get maximum energy when you get energy'
                },
                {
                    name: 'massive impact',
                    canUse: (character: Character) => {
                        return character.impact >= 20 && !character.triggers_on_impact.some(elem => elem instanceof MassiveImpactTrigger)
                    },
                    teach: (character: Character): void => {
                        character.triggers_on_impact.push(new MassiveImpactTrigger())
                    },
                    cost: 6,
                    ascend: 14,
                    desc: 'gives a chance, depending on your might to create additional impacts'
                },
                {
                    name: 'divine weapon',
                    canUse: (character: Character) => {
                        return character.will >= 5 && !character.triggers_on_hit.some(elem => elem instanceof DivineWeaponTrigger)
                    },
                    teach: (character: Character): void => {
                        character.triggers_on_hit.push(new DivineWeaponTrigger())
                    },
                    cost: 8,
                    ascend: 20,
                    desc: 'gives a chance, depending on your will to rain down pillars of light on enemies when you hit'
                },
                {
                    name: 'unhuman fortitude',
                    canUse: (character: Character) => {
                        return character.durability >= 10 && !character.triggers_on_get_hit.some(elem => elem instanceof UnhumanFortitudeTrigger)
                    },
                    teach: (character: Character): void => {
                        character.triggers_on_get_hit.push(new UnhumanFortitudeTrigger())
                    },
                    cost: 8,
                    ascend: 14,
                    desc: 'gives a 30% chance when you get damage add fortify equals your durability'
                },
                {
                    name: 'ressurection',
                    canUse: (character: Character) => {
                        return !character.can_ressurect
                    },
                    teach: (character: Character): void => {
                        character.can_ressurect = true
                    },
                    cost: 10,
                    ascend: 30,
                    desc: 'returns you after dead'
                },
                {
                    name: 'with storm',
                    type: 'status',
                    canUse: (character: Character) => {
                        return !character.level.status_pull.find(elem => elem.unit === character && elem instanceof WithStormStatus)
                    },
                    teach: (character: Character): void => {
                        let status = new WithStormStatus(character.level.time)
                        status.setPower(0)
                        character.level.setStatus(character, status, true)
                    },
                    cost: 3,
                    ascend: 5,
                    desc: 'creates lightning periodically which shocks enemies, upgrade increases frequency and radius of searching enemies'
                },
                {
                    name: 'move speed',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character): void => {
                        character.move_speed_penalty += 2
                    },
                    cost: 5,
                    ascend: 15,
                    desc: 'increases move speed'
                },
                 {
                    name: 'lightning reflexes',
                    canUse: (character: Character) => {
                        return character.agility >= 10 && character.armour_rate < 200
                    },
                    teach: (character: Character): void => {
                        character.armour_rate += 20
                    },
                    cost: 5,
                    ascend: 20,
                    desc: 'increases your armour by 20'
                },
                {
                    name: 'titanic strikes',
                    canUse: (character: Character) => {
                        return character.might >= 10 && character.impact < 100
                    },
                    teach: (character: Character): void => {
                        character.impact += 20
                    },
                    cost: 5,
                    ascend: 20,
                    desc: 'increases your impact rating by 20'
                },
                {
                    name: 'clear mind',
                    canUse: (character: Character) => {
                        return character.will >= 12 && character.cooldown_redaction < 100
                    },
                    teach: (character: Character): void => {
                        character.cooldown_redaction += 15
                    },
                    cost: 7,
                    ascend: 22,
                    desc: 'increases your cooldown redaction by 15'
                },
                {
                    name: 'afterlight',
                    canUse: (character: Character) => {
                        return !character.triggers_on_enlight.some(elem => elem instanceof WardAfterEnlightTrigger)
                    },
                    teach: (character: Character): void => {
                        character.triggers_on_enlight.push(new WardAfterEnlightTrigger())
                    },
                    cost: 5,
                    ascend: 18,
                    desc: 'you are getting 5 ward when you enlight'
                },
                 {
                    name: 'spirit strikes',
                    canUse: (character: Character) => {
                        return !character.spirit_strikes
                    },
                    teach: (character: Character): void => {
                        character.spirit_strikes = true
                    },
                    cost: 8,
                    ascend: 16,
                    desc: 'impact rating increased by you ward count'
                },
                {
                    name: 'immune to freeze',
                    canUse: (character: Character) => {
                        return !character.immune_to_freeze
                    },
                    teach: (character: Character): void => {
                        character.immune_to_freeze = true
                    },
                    cost: 20,
                    ascend: 50,
                    desc: 'immune to freeze'
                },
                {
                    name: 'ascending',
                    canUse: (character: Character) => {
                        return character.ascend_level <= 25
                    },
                    teach: (character: Character): void => {
                        character.ascend_level += 4
                    },
                    cost: 5,
                    ascend:5,
                    desc: 'icreases ascend level by 5'
                },
                {
                    name: 'with fire',
                    type: 'status',
                    canUse: (character: Character) => {
                        return !character.level.status_pull.find(elem => elem.unit === character && elem instanceof WithFireStatus)
                    },
                    teach: (character: Character) => {
                        let status = new WithFireStatus(character.level.time)
                        status.setPower(0)
                        character.level.setStatus(character, status, true)
                    },
                    cost: 3,
                    ascend: 5,
                    desc: 'creates flames periodically which burn enemies and players, upgrade increases size of flames and stop damaging players'
                },
                {
                    name: 'with cold',
                    type: 'status',
                    canUse: (character: Character) => {
                        return !character.level.status_pull.find(elem => elem.unit === character && elem instanceof WithColdStatus)
                    },
                    teach: (character: Character) => {
                        let status = new WithColdStatus(character.level.time)
                        status.setPower(0)
                        character.level.setStatus(character, status, true)
                    },
                    cost: 3,
                    ascend: 5,
                    desc: 'creates cold explosion periodically which freeze enemies and players, upgrade increases radius and frequency'
                },
                {
                    name: 'increase perception',
                    canUse: (character: Character) => {
                        return character.perception != undefined
                    },
                    teach: (character: Character) => {
                        character.perception ++
                    },
                    cost: 1,
                    desc: 'increases your perception'
                },
                {
                    name: 'increase knowledge',
                    canUse: (character: Character) => {
                        return character.knowledge != undefined
                    },
                    teach: (character: Character) => {
                        character.knowledge ++
                    },
                    cost: 1,
                    desc: 'increases your knowledge'
                },
                {
                    name: 'increase power',
                    canUse: (character: Character) => {
                        return character.might != undefined
                    },
                    teach: (character: Character) => {
                        character.might ++
                    },
                    cost: 1,
                    desc: 'increases your might'
                },
                {
                    name: 'increase durability',
                    canUse: (character: Character) => {
                        return character.durability != undefined
                    },
                    teach: (character: Character) => {
                        character.durability ++
                    },
                    cost: 1,
                    desc: 'increases your durability'
                },
                {
                    name: 'increase will',
                    canUse: (character: Character) => {
                        return character.will != undefined
                    },
                    teach: (character: Character) => {
                        character.will ++
                    },
                    cost: 1,
                    desc: 'increases your will'
                },
                {
                    name: 'increase agility',
                    canUse: (character: Character) => {
                        return character.agility != undefined
                    },
                    teach: (character: Character) => {
                        character.agility ++
                    },
                    cost: 1,
                    desc: 'increases your agility'
                },
                {
                    name: 'heal',
                    canUse: (character: Character) => {
                        return character.life_status < 4
                    },
                    teach: (character: Character) => {
                        character.addLife(3, true, true)
                    },
                    cost: 1,
                    desc: 'give a life'
                },
                {
                    name: 'chosen one',
                    canUse: (character: Character) => {
                        return character.chance_to_create_grace < 50
                    },
                    teach: (character: Character) => {
                        character.chance_to_create_grace += 5
                    },
                    cost: 6,
                    ascend: 16,
                    desc: 'increases your chance to get grace after enemy dead'
                },
                {
                    name: 'blessed',
                    canUse: (character: Character) => {
                        return !character.blessed
                    },
                    teach: (character: Character) => {
                        character.blessed = true
                    },
                    cost: 4,
                    ascend: 12,
                    desc: 'bones killed by your have reduced chance to ressurect'
                },
                 {
                    name: 'pressure',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character) => {
                        character.pierce += 3
                    },
                    cost: 2,
                    desc: 'increases a pierce rating by 3'
                },
                {
                    name: 'critical hit',
                    canUse: (character: Character) => {
                        return character.critical < 100
                    },
                    teach: (character: Character) => {
                        character.critical += 2
                    },
                    cost: 2,
                    desc: 'give a chance to deal double damage'
                },
                {
                    name: 'armour',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character) => {
                        character.armour_rate += 3
                    },
                    cost: 3,
                    desc: 'adds armour rate'
                },
                {
                    name: 'gamble',
                    canUse: (character: Character) => {
                        return character.grace > 1
                    },
                    teach: (character: Character) => {
                        if(Func.chance(50, character.is_lucky)){
                            character.grace *= 2
                        }
                        else{
                            character.grace = Math.floor(character.grace / 2)
                        }
                    },
                    cost: 0,
                    desc: 'lose or get grace'
                },
                {
                    name: 'resist',
                    canUse: (character: Character) => {
                        return character.status_resistance < 80
                    },
                    teach: (character: Character) => {
                        character.status_resistance += 3
                    },
                    cost: 2,
                    desc: 'increases chance to resist status'
                },
                {
                    name: 'lust for life',
                    canUse: (character: Character) => {
                        return !character.lust_for_life
                    },
                    teach: (character: Character) => {
                        character.lust_for_life = true
                    },
                    cost: 4,
                    ascend: 10,
                    desc: 'you have a chance based of your courage to regen more than life status limit("good")'
                },
                {
                    name: 'vision',
                    canUse: (character: Character) => {
                        return character.light_r < 30
                    },
                    teach: (character: Character) => {
                        character.light_r += 2
                    },
                    cost: 1,
                    desc: 'increases your vision'
                },
                {
                    name: 'touch',
                    type: 'buff',
                    canUse: (character: Character) => {
                        return character.after_grace_statuses.filter(elem => elem.name === 'touch').length === 0
                    },
                    teach: (character: Character) => {
                        let status = new Touch(character.level.time)
                        status.setDuration(40000)
                        character.after_grace_statuses.push(status)
                    },
                    cost: 3,
                    ascend: 20,
                    desc: 'gives a buff after living grace which increases all stats by 10'
                },
                {
                    name: 'blessed armour',
                    type: 'buff',
                    canUse: (character: Character) => {
                        return character.after_grace_statuses.filter(elem => elem.name === 'blessed armour').length === 0
                    },
                    teach: (character: Character) => {
                        let status = new BlessedArmour(character.level.time)
                        status.setDuration(30000)
                        character.after_grace_statuses.push(status)
                    },
                    cost: 3,
                    ascend: 10,
                    desc: 'gives a buff after living grace which increases all stats by 10'
                },
                {
                    name: 'talkativeness',
                    canUse: (character: Character) => {
                        return character.chance_to_say_phrase < 3
                    },
                    teach: (character: Character) => {
                        character.chance_to_say_phrase ++
                    },
                    cost: 2,
                    desc: 'increases a chance to say something'
                },
                {
                    name: 'swiftness',
                    canUse: (character: Character) => {
                        return character.cooldown_redaction < 90
                    },
                    teach: (character: Character) => {
                        character.cooldown_redaction += 2
                    },
                    cost: 4,
                    desc: 'reduces cooldowns'
                },
                {
                    name: 'small ward',
                    canUse: (character: Character) => {
                        return character.ward === 0
                    },
                    teach: (character: Character) => {
                        character.addWard(3)
                    },
                    cost: 1,
                    ascend: 6,
                    desc: 'gives you 3 ward'
                },
                {
                    name: 'strong ward',
                    canUse: (character: Character) => {
                        return character.ward <= 5
                    },
                    teach: (character: Character) => {
                        character.addWard(10)
                    },
                    cost: 4,
                    ascend: 25,
                    desc: 'gives you 10 ward'
                },
                {
                    name: 'redemption',
                    canUse: (character: Character) => {
                        return !character.level.status_pull.find(elem => elem.unit === character && elem instanceof Redemption)
                    },
                    teach: (character: Character) => {
                        let s = new Redemption(character.level.time)
                        
                        character.level.setStatus(character, s)
                    },
                    cost: 10,
                    ascend: 40,
                    desc: 'may consumes a corpse to create sphere'
                },
                {
                    name: 'flesh harvest',
                    canUse: (character: Character) => {
                        return !character.level.status_pull.find(elem => elem.unit === character && elem instanceof FleshHarvest)
                    },
                    teach: (character: Character) => {
                        let s = new FleshHarvest(character.level.time)
                        
                        character.level.setStatus(character, s)
                    },
                    cost: 10,
                    ascend: 30,
                    desc: 'may consumes a corpse to heal you'
                },
                {
                name: 'discipline',
                canUse: (character: Character) => {
                    return character.maximum_resources < 12
                },
                teach: (character: Character) => {
                    if(character instanceof Character){
                        character.maximum_resources ++
                    }
                },
                cost: 6,
                ascend: 16,
                desc: 'increases maximum of energy'
                },
                {
                name: 'impact',
                canUse: (character: Character) => {
                    return character.impact < 100
                },
                teach: (character: Character) => {
                    if(character instanceof Character){
                        character.impact ++
                    }
                },
                cost: 2,
                ascend: 6,
                desc: 'increases impact rating'
                },
                {
                name: 'penetrating',
                canUse: (character: Character) => {
                    return character.penetrate < 100
                },
                teach: (character: Character) => {
                    if(character instanceof Character){
                        character.penetrate ++
                    }
                },
                cost: 2,
                desc: 'increases penetrate rating'
                },
                {
                name: 'spirit',
                canUse: (character: Character) => {
                    return character.spirit < 100
                },
                teach: (character: Character) => {
                    if(character instanceof Character){
                        character.spirit ++
                    }
                },
                cost: 2,
                desc: 'increases chance lose energy instead life when get damage'
                },
        ]
    }
    static getCultistUpgrades(){
        return [
            {
                name: 'runefield',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Rune && !character.first_ability.runefield
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Rune){
                        character.first_ability.runefield = true
                        character.first_ability.cost += 1
                    }
                },
                cost: 5,
                ascend: 15,
                desc: 'you will create additional rune for each resourse but now it also increased cost by 1'
            },
            {
                name: 'explosive runes',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Rune && !character.first_ability.explosive
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Rune){
                        character.first_ability.explosive = true
                    }
                },
                cost: 2,
                ascend: 8,
                desc: 'increases radius of explosion'
            },
            {
                name: 'fast detonation',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Rune && !character.first_ability.fast_detonation
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Rune){
                        character.first_ability.fast_detonation = true
                    }
                },
                cost: 3,
                ascend: 20,
                desc: 'increases detonation rate'
            },
            {
                name: 'second detanation',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Rune && !character.first_ability.second_detanation
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Rune){
                        character.first_ability.second_detanation = true
                        character.first_ability.cost ++
                    }
                },
                cost: 1,
                ascend: 25,
                desc: 'your runes have a chance to explode additional time but now it also increased cost by 1'
            },
            {
                name: 'soul shatter',
                type: 'new ability',
                canUse: (character: Character) => {
                    return !(character.first_ability instanceof SoulShatter)
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                        character.first_ability = new SoulShatter(character)
                        character.updateClientSkill()
                    }
                },
                cost: 4,
                ascend: 10,
                desc: 'hit the single enemy if they died, create a soul projectiles count them based of your resourses'
            },
            {
                name: 'slaming',
                type: 'slam',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Slam && !character.first_ability.slaming
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Slam){
                        character.first_ability.slaming = true
                    }
                },
                cost: 1,
                ascend: 6,
                desc: 'increases the radius of slam hit'
            },
            {
                name: 'soul extraction',
                type: 'slam',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Slam && !character.first_ability.soul_extraction
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Slam){
                        character.first_ability.soul_extraction = true
                    }
                },
                cost: 2,
                ascend: 20,
                desc: 'increases the chance to get grace from killing enemies'
            },
            {
                name: 'deafening wave',
                type: "shield bash",
                canUse: (character: Character) => {
                    return character.second_ability instanceof ShieldBash &&
                    !character.second_ability.deafening_wave &&
                    !character.second_ability.hate

                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof ShieldBash){
                        character.second_ability.deafening_wave = true
                    }
                },
                cost: 2,
                ascend: 10,
                desc: 'increases duration and radius of stuning'
            },
            {
                name: 'hate',
                type: "shield bash",
                canUse: (character: Character) => {
                     return character.second_ability instanceof ShieldBash &&
                    !character.second_ability.deafening_wave &&
                    !character.second_ability.hate
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof ShieldBash){
                        character.second_ability.deafening_wave = true
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'now your shield bash does not stun instead it has a chance to shatter enemy and to realise they bones that also can damage enemy'
            },
            {
                name: 'coordination',
                type: 'shield bash',
                canUse: (character: Character) => {
                     return character.second_ability instanceof ShieldBash &&
                    !character.second_ability.coordination
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof ShieldBash){
                        character.second_ability.coordination = true
                    }
                },
                cost: 3,
                ascend: 8,
                desc: 'now your shield bash has a chance to reduce attack speed by 50% and now it has chance not to be used after using'
            },
            {
                name: 'increase grim pile effect',
                type: 'grim pile',
                canUse: (character: Character) => {
                     return character.second_ability instanceof GrimPile &&
                    !character.second_ability.increased_effect
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof GrimPile){
                        character.second_ability.increased_effect = true
                    }
                },
                cost: 1,
                desc: 'increases armour rate and move speed which it gives'
            },
            {
                name: 'grim pile of will',
                type: 'grim pile',
                canUse: (character: Character) => {
                     return character.second_ability instanceof GrimPile &&
                    !character.second_ability.resistance
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof GrimPile){
                        character.second_ability.resistance = true
                    }
                },
                cost: 1,
                ascend: 18,
                desc: 'now it also increase status resist'
            },
            {
                name: 'reign of pain',
                type: "unleash pain",
                canUse: (character: Character) => {
                     return character.third_ability instanceof UnleashPain &&
                    !character.third_ability.reign_of_pain
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof UnleashPain){
                        character.third_ability.reign_of_pain = true
                    }
                },
                cost: 1,
                ascend: 25,
                desc: 'increases radius for searching enemies and count of ghost warriors for each resourse'
            },
            {
                name: 'spreading',
                type: 'self flagellation',
                canUse: (character: Character) => {
                     return character.utility instanceof SelfFlagellation &&
                    !character.utility.spreading
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof SelfFlagellation){
                        character.utility.spreading = true
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'deals damage in small radius'
            },
            {
                name: 'restless warriors',
                type: "unleash pain",
                canUse: (character: Character) => {
                     return character.third_ability instanceof UnleashPain &&
                    !character.third_ability.restless_warriors
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof UnleashPain){
                        character.third_ability.restless_warriors = true
                    }
                },
                cost: 3,
                ascend: 12,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'ring of pain',
                type: 'pile of thorns',
                canUse: (character: Character) => {
                     return character.third_ability instanceof PileOfThornCast &&
                    !character.third_ability.ring_of_pain
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof PileOfThornCast){
                        character.third_ability.ring_of_pain = true
                    }
                },
                cost: 3,
                ascend: 12,
                desc: 'increases radius and frequency'
            },
            {
                name: 'collection of bones',
                type: 'pile of thorns',
                canUse: (character: Character) => {
                     return character.third_ability instanceof PileOfThornCast &&
                    !character.third_ability.collection_of_bones
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof PileOfThornCast){
                        character.third_ability.collection_of_bones = true
                    }
                },
                cost: 1,
                ascend: 9,
                desc: 'after duration realise bones for each killed enemy'
            },
            {
                name: 'pack with dead',
                type: 'self flagellation',
                canUse: (character: Character) => {
                     return character.utility instanceof SelfFlagellation &&
                    !character.utility.pack
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof SelfFlagellation){
                        character.utility.pack = true
                    }
                },
                cost: 1,
                desc: 'you cannot die by ability'
            },
            {
                name: 'lesson of pain' ,
                type: 'self flagellation',
                canUse: (character: Character) => {
                     return character.utility instanceof SelfFlagellation &&
                    !character.utility.lesson
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof SelfFlagellation){
                        character.utility.lesson = true
                    }
                },
                cost: 1,
                ascend: 20,
                desc: 'increases move speed for short period after use'
            },
            {
                name: 'leaded by shost',
                type: 'ghost form',
                canUse: (character: Character) => {
                     return character.utility instanceof GhostForm &&
                    !character.utility.lead
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof GhostForm){
                        character.utility.lead = true
                    }
                },
                cost: 1,
                ascend: 15,
                desc: 'your teammates also give buff'
            },
            {
                name: 'afterlife cold',
                type: 'ghost form',
                canUse: (character: Character) => {
                     return character.utility instanceof GhostForm &&
                    !character.utility.afterlife_cold
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof GhostForm){
                        character.utility.afterlife_cold = true
                    }
                },
                cost: 1,
                ascend: 12,
                desc: 'freeze enemies on the way'
            },
            {
                name: 'service',
                canUse: (character: Cultist) => {
                    return !character.service
                },
                teach: (character: Cultist) => {
                    character.service = true
                },
                cost: 2,
                ascend: 20,
                desc: 'you have a chance to get resourse when you regen life'
            },
            {
                name: 'conduct of pain',
                canUse: (character: Cultist) => {
                    return !character.conduct_of_pain
                },
                teach: (character: Cultist) => {
                    character.conduct_of_pain = true
                },
                cost: 2,
                ascend: 15,
                desc: 'you have a chance to get resourse when you block hit'
            },
            {
                name: 'pain extract',
                canUse: (character: Cultist) => {
                    return !character.pain_extract
                },
                teach: (character: Cultist) => {
                    character.pain_extract = true
                },
                cost: 3,
                ascend: 35,
                desc: 'you have a chance to get resourse when you kill enemies'
            },
            {
                name: 'burning circle',
                type: 'new ability',
                canUse: (character: Character) => {
                    return character instanceof Cultist && !(character.second_ability instanceof BurningCircle)
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.second_ability = new BurningCircle(character)
                       character.updateClientSkill()
                    }  
                },
                cost: 5,
                ascend: 15,
                desc: 'creates a circle of fire by damaging youself in which enemies take damage, the frequency of receiving damage depends on courage'
            },
            {
                name: 'all-consuming flame',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return character instanceof Cultist && character.second_ability instanceof BurningCircle && !character.second_ability.consuming
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist && character.second_ability instanceof BurningCircle){
                       character.second_ability.consuming = true
                    }  
                },
                cost: 2,
                ascend: 20,
                desc: 'increases radius'
            },
            {
                name: 'fire hatred',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return character instanceof Cultist && character.second_ability instanceof BurningCircle && !character.second_ability.hatred
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist && character.second_ability instanceof BurningCircle){
                       character.second_ability.hatred = true
                    }  
                },
                cost: 1,
                ascend: 15,
                desc: 'gives a chance to create explode when your kill enemy'
            },
            {
                name: 'devouring flame',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return character instanceof Cultist && character.second_ability instanceof BurningCircle && !character.second_ability.devouring
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist && character.second_ability instanceof BurningCircle){
                       character.second_ability.devouring = true
                    }  
                },
                cost: 1,
                ascend: 15,
                desc: 'gives a chance to increase duration when you kill enemy'
            },
            {
                name: 'spiritual call',
                canUse: (character: Character) => {
                    return !character.triggers_on_block.some(elem => elem instanceof CallWarriorWhenBlock)
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.triggers_on_block.push(new CallWarriorWhenBlock())
                    }  
                },
                cost: 1,
                ascend: 12,
                desc: 'when you block you can summon spirit warrior'
            },
            {
                name: 'soul fragments',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Soulrender && !character.first_ability.soul_fragments
                },
                teach: (character: Character) => {
                    if(character.first_ability instanceof Soulrender){
                        character.first_ability.soul_fragments = true
                    }
                },
                cost: 1,
                ascend: 10,
                desc: 'increases the count of shards after tear enemy'
            },
        ]
    }
    static getFlyerUpgrades(){
            return [
                {
                        name: 'fire spliting',
                        type: 'fireball',
                        canUse: (character: Character) => {
                            return character.first_ability instanceof Fireball && !character.first_ability.fire_splitting
                        },
                        teach: (character: Character) => {
                            if(character && character.first_ability instanceof Fireball){
                                character.first_ability.fire_splitting = true
                            }
                        },
                        cost: 3,
                        ascend: 20,
                        desc: 'your fireball has a chance to create additional projectiles based on your courage'
                    },
                    {
                        name: 'icicles',
                        type: 'frost sphere',
                        canUse: (character: Character) => {
                            return character.first_ability instanceof FrostSphere && !character.first_ability.icicles
                        },
                        teach: (character: Character) => {
                            if(character && character.first_ability instanceof FrostSphere){
                                character.first_ability.icicles = true
                            }
                        },
                        cost: 5,
                        ascend: 16,
                        desc: 'your frost sphere releases icicles while moving count depends on you courage'
                    },
                    {
                        name: 'scorching',
                        type: '(flame wall)',
                        canUse: (character: Character) => {
                            return character.second_ability instanceof FlameWall && !character.second_ability.scorching
                        },
                        teach: (character: Character) => {
                            if(character && character.second_ability instanceof FlameWall){
                                character.second_ability.scorching = true
                            }
                        },
                        cost: 3,
                        ascend: 5,
                        desc: 'your flamewall burn faster'
                    },
                    {
                        name: 'frendly flame',
                        type: '(flame wall)',
                        canUse: (character: Character) => {
                            return character.second_ability instanceof FlameWall && !character.second_ability.frendly_flame
                        },
                        teach: (character: Character) => {
                            if(character && character.second_ability instanceof FlameWall){
                                character.second_ability.frendly_flame = true
                            }
                        },
                        cost: 1,
                        ascend: 10,
                        desc: 'your flamewall does not damage to players'
                    },
                    {
                        name: 'takeoff',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && !character.takeoff
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer){
                                character.takeoff = true
                            }
                        },
                        cost: 2,
                        ascend: 8,
                        desc: 'gives your phasing while you are defended'
                    },
                     {
                        name: 'teeth',
                        type: 'new ability',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && !(character.first_ability instanceof Teeth)
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer){
                                character.first_ability = new Teeth(character)
                                character.updateClientSkill()
                            }
                        },
                        cost: 5,
                        ascend: 10,
                        desc: 'fires a sereral of teeth'
                    },
                    {
                        name: 'body melting',
                        type: 'fireball',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.first_ability instanceof Fireball) && !character.first_ability.body_melting
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.first_ability instanceof Fireball){
                                character.first_ability.body_melting = true
                            }
                        },
                        cost: 2,
                        ascend: 7,
                        desc: 'gives your fireball a chance to pierce the enemy'
                    },
                    {
                        name: 'ignite',
                        type: 'fireball',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.first_ability instanceof Fireball) && !character.first_ability.ignite
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.first_ability instanceof Fireball){
                                character.first_ability.ignite = true
                            }
                        },
                        cost: 3,
                        ascend: 10,
                        desc: 'your fireball ignites the floor after explosion'
                    },
                    {
                        name: 'hand of frost',
                        type: 'frost sphere',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.first_ability instanceof FrostSphere) && !character.first_ability.frost_rich
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.first_ability instanceof FrostSphere){
                                character.first_ability.frost_rich = true
                            }
                        },
                        cost: 1,
                        ascend: 5,
                        desc: 'increases radius of explosion'
                    },
                    {
                        name: 'reign of frost',
                        type: 'frost sphere',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.first_ability instanceof FrostSphere) && !character.first_ability.reign_of_frost
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.first_ability instanceof FrostSphere){
                                character.first_ability.reign_of_frost = true
                            }
                        },
                        cost: 1,
                        ascend: 5,
                        desc: 'increases freeze duration'
                    },
                    {
                        name: 'high voltage',
                        type: 'lightning bolt',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.first_ability instanceof LightningBolt) && !character.first_ability.high_voltage
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.first_ability instanceof LightningBolt){
                                character.first_ability.high_voltage = true
                            }
                        },
                        cost: 2,
                        ascend: 3,
                        desc: 'now your lightning bolt does not apply shock and hit up to 3 targets by default also number of hitting enemies is increased by might'
                    },
                    {
                        name: 'storm',
                        type: 'lightning bolt',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.first_ability instanceof LightningBolt) && !character.first_ability.storm
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.first_ability instanceof LightningBolt){
                                character.first_ability.storm = true
                                character.first_ability.cost += 1
                            }
                        },
                        cost: 2,
                        ascend: 10,
                        desc: 'now your lightning bolt also hit 2 additional times in close area but mana cost is increased'
                    },
                    {
                        name: 'improved chain reaction',
                        type: 'forking lightning',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.second_ability instanceof ForkedLightning) && !character.second_ability.improved_chain_reaction
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.second_ability instanceof ForkedLightning){
                                character.second_ability.improved_chain_reaction = true
                            }
                        },
                        cost: 2,
                        ascend: 5,
                        desc: 'increases the chain chance'
                    },
                    {
                        name: 'lightning eye',
                        type: 'forking lightning',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.second_ability instanceof ForkedLightning) && !character.second_ability.lightning_eye
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.second_ability instanceof ForkedLightning){
                                character.second_ability.lightning_eye = true
                            }
                        },
                        cost: 1,
                        ascend: 3,
                        desc: 'increases the radius of checking targets for chain'
                    },
                    {
                        name: 'lightning waves',
                        type: 'light beacon',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.third_ability instanceof LightBeacon) && !character.third_ability.lightning_waves
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.third_ability instanceof LightBeacon){
                                character.third_ability.lightning_waves = true
                            }
                        },
                        cost: 4,
                        ascend: 12,
                        desc: 'now you crates wavas of electricity instead lightnings'
                    },
                    {
                        name: 'air form',
                        type: 'light beacon',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.third_ability instanceof LightBeacon) && !character.third_ability.air_form
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.third_ability instanceof LightBeacon){
                                character.third_ability.air_form = true
                            }
                        },
                        cost: 2,
                        ascend: 8,
                        desc: 'after cast you cant take damage for 3 seconds'
                    },
                    {
                        name: 'ice genesis',
                        type: 'frostnova',
                        canUse: (character: Character) => {
                            return character.third_ability instanceof Frostnova && !character.third_ability.ice_genesis
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.third_ability instanceof Frostnova){
                                character.third_ability.ice_genesis = true
                            }
                        },
                        cost: 5,
                        ascend: 12,
                        desc: 'if you kill the enemy there is a chance to create frost sphere'
                    },
                    {
                        name: 'cold spires',
                        type: 'frostnova',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.third_ability instanceof Frostnova) && !character.third_ability.cold_spires
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.third_ability instanceof Frostnova){
                                character.third_ability.cold_spires = true
                            }
                        },
                        cost: 5,
                        ascend: 10,
                        desc: 'after cast you create a cold spires which freeze enemies and explodes'
                    },
                    {
                        name: 'hand cuffing',
                        type: 'static field',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.utility instanceof StaticField) && !character.utility.hand_cuffing
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.utility instanceof StaticField){
                                character.utility.hand_cuffing = true
                            }
                        },
                        cost: 1,
                        ascend: 6,
                        desc: 'targets cant attack'
                    },
                    {
                        name: 'collapse',
                        type: 'static field',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.utility instanceof StaticField) && !character.utility.collapse
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.utility instanceof StaticField){
                                character.utility.collapse = true
                            }
                        },
                        cost: 1,
                        ascend: 15,
                        desc: 'targets take damage after duration'
                    },
                    {
                        name: 'protected teleportation',
                        type: 'teleportation',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.utility instanceof Teleportation) && !character.utility.protected
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.utility instanceof Teleportation){
                                character.utility.protected = true
                            }
                        },
                        cost: 1,
                        ascend: 6,
                        desc: 'you cannot take damage after you start teleportating'
                    },
                    {
                        name: 'increased gate',
                        type: 'teleportation',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && (character.utility instanceof Teleportation) && !character.utility.increased_gate
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && character.utility instanceof Teleportation){
                                character.utility.increased_gate = true
                            }
                        },
                        cost: 1,
                        ascend: 3,
                        desc: 'increases radius of end point'
                    },
                    {
                        name: 'mana regen while defend',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && !character.allow_mana_regen_while_def
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && !character.allow_mana_regen_while_def){
                                character.allow_mana_regen_while_def = true
                            }
                        },
                        cost: 5,
                        ascend: 12,
                        desc: 'you can regen mana while you are defended'
                    },
                    {
                        name: 'charged shield',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && !character.charged_shield
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer && !character.charged_shield){
                                character.charged_shield = true
                            }
                        },
                        cost: 1,
                        ascend: 4,
                        desc: 'there is a chance to create lightning when you block damage while you are defended'
                    },
                    {
                        name: 'annihilator beam',
                        type: 'new ability',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && !(character.second_ability instanceof AnnihilatorBeam)
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer){
                                character.second_ability = new AnnihilatorBeam(character)
                                character.updateClientSkill()
                            }
                        },
                        cost: 3,
                        ascend: 5,
                        desc: 'creates a beam of energy which burn enemies'
                    },
                    {
                        name: 'light stream',
                        type: 'annihilator beam',
                        canUse: (character: Character) => {
                            return character.second_ability instanceof AnnihilatorBeam && character.second_ability.cost >= 5
                        },
                        teach: (character: Character) => {
                            if(character.second_ability instanceof AnnihilatorBeam){
                                character.second_ability.cost -= 2
                            }
                        },
                        cost: 1,
                        ascend: 6,
                        desc: 'reduses mana cost'
                    },
                    {
                        name: 'concentrating energy',
                        type: 'annihilator beam',
                        canUse: (character: Character) => {
                            return character.second_ability instanceof AnnihilatorBeam && !character.second_ability.concentrating_energy
                        },
                        teach: (character: Character) => {
                            if(character.second_ability instanceof AnnihilatorBeam) {
                                character.second_ability.concentrating_energy = true
                            }
                        },
                        cost: 1,
                        ascend: 8,
                        desc: 'now it ignores armour'
                    },
                    {
                        name: 'mental shield',
                        canUse: (character: Character) => {
                            return character instanceof Flyer && !character.mental_shield
                        },
                        teach: (character: Character) => {
                            if(character instanceof Flyer){
                                character.mental_shield = true
                            }
                        },
                        cost: 1,
                        ascend: 10,
                        desc: 'courage increase your armour rate'
                    },
                    {
                        name: 'penetrating lightning',
                        type: 'sparks',
                        canUse: (character: Character) => {
                            return character.third_ability instanceof Sparks && character.third_ability.pierce < 3
                        },
                        teach: (character: Character) => {
                            if(character.third_ability instanceof Sparks){
                                character.third_ability.pierce ++
                            }
                        },
                        cost: 3,
                        ascend: 8,
                        desc: 'increases the number of enemies your sparks can pass through'
                    },
                    {
                        name: 'strong sparks',
                        type: 'sparks',
                        canUse: (character: Character) => {
                            return character.third_ability instanceof Sparks && character.third_ability.ttl < 10000
                        },
                        teach: (character: Character) => {
                            if(character.third_ability instanceof Sparks){
                                character.third_ability.ttl += 2000
                            }
                        },
                        cost: 3,
                        ascend: 9,
                        desc: 'increases the duration'
                    },
            ]
    }
    static getSwordmanUpgrades(){
        return [
            {
                name: 'crushing swings',
                type: 'weapon swing',
                canUse: (character: Character) => {
                    return character.first_ability instanceof WeaponSwing && !character.first_ability.crushing
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof WeaponSwing){
                        character.first_ability.crushing = true
                    }
                },
                cost: 4,
                ascend: 20,
                desc: 'increase attack range and slash angle'
            },
            {
                name: 'echo swing',
                type: 'weapon swing',
                canUse: (character: Character) => {
                    return character.first_ability instanceof WeaponSwing && !character.first_ability.echo_swing
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof WeaponSwing){
                        character.first_ability.echo_swing = true
                    }
                },
                cost: 4,
                ascend: 8,
                desc: 'gives your weapon swing chance to land an additional swing after a short time'
            },
            {
                name: 'improved swing technology',
                type: 'weapon swing',
                canUse: (character: Character) => {
                    return character.first_ability instanceof WeaponSwing && !character.first_ability.improved_swing_technology
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof WeaponSwing){
                        character.first_ability.improved_swing_technology = true
                    }
                },
                cost: 4,
                ascend: 12,
                desc: 'gives your weapon swing chance to increase move and attack speed for a short period'
            },
            {
                name: 'light grip',
                type: 'weapon throw',
                canUse: (character: Character) => {
                    return character.first_ability instanceof WeaponThrow && !character.first_ability.light_grip
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof WeaponThrow){
                        character.first_ability.light_grip = true
                    }
                },
                cost: 5,
                ascend: 16,
                desc: 'gives your weapon throw ability a chance to reduce cd time between uses by 50%'
            },
            {
                name: 'multiple blades',
                type: 'weapon throw',
                canUse: (character: Character) => {
                    return character.first_ability instanceof WeaponThrow && !character.first_ability.multiple
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof WeaponThrow){
                        character.first_ability.multiple = true
                    }
                },
                cost: 8,
                ascend: 20,
                desc: 'can create additional copies your throwed weapon'
            },
            {
                name: 'returning',
                type: 'weapon throw',
                canUse: (character: Character) => {
                    return character.first_ability instanceof WeaponThrow && !character.first_ability.returning && !character.first_ability.shattering
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof WeaponThrow){
                        character.first_ability.returning = true
                    }
                },
                cost: 6,
                ascend: 26,
                desc: 'gives your weapon throw ability a chance to return'
            },
            {
                name: 'while we alive',
                type: 'inner power',
                canUse: (character: Character) => {
                    let status = character.level.status_pull.find(elem => elem.unit === character && elem instanceof InnerPowerTrigger)
                    if(!status || !(status instanceof InnerPowerTrigger)) return

                    return !status.while_alive
                },
                teach: (character: Character) => {
                    let status = character.level.status_pull.find(elem => elem.unit === character && elem instanceof InnerPowerTrigger)
                    if(!status || !(status instanceof InnerPowerTrigger)) return

                    status.while_alive = true
                },
                cost: 3,
                ascend: 30,
                desc: 'your inner power passive also gives a fortify(40%)'
            },
            {
                name: 'shattering',
                type: 'weapon throw',
                canUse: (character: Character) => {
                    return character.first_ability instanceof WeaponThrow && !character.first_ability.returning && !character.first_ability.shattering
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof WeaponThrow){
                        character.first_ability.shattering = true
                    }
                },
                cost: 6,
                ascend: 26,
                desc: 'gives your weapon throw ability a chance to shatter up to 3 shards'
            },
            {
                name: 'heavy landing',
                type: 'jump',
                canUse: (character: Character) => {
                    return character.second_ability instanceof Jump && !character.second_ability.heavy_landing
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof Jump){
                        character.second_ability.heavy_landing = true
                    }
                },
                cost: 4,
                ascend: 12,
                desc: 'after landing by jump ability your will get armour by each hited enemy'
            },
             {
                name: 'stomp',
                type: 'jump',
                canUse: (character: Character) => {
                    return character.second_ability instanceof Jump && !character.second_ability.stomp
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof Jump){
                        character.second_ability.stomp = true
                    }
                },
                cost: 5,
                ascend: 26,
                desc: 'increases the radius in which enemies will take damage'
            },
            {
                name: 'destroyer',
                type: 'charge',
                canUse: (character: Character) => {
                    return character.second_ability instanceof Charge && !character.second_ability.destroyer
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof Charge){
                        character.second_ability.destroyer = true
                    }
                },
                cost: 4,
                ascend: 12,
                desc: 'gives a chance to deal damage by charge ability'
            },
            {
                name: 'vision of possibilities',
                type: 'charge',
                canUse: (character: Character) => {
                    return character.second_ability instanceof Charge && !character.second_ability.possibilities
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof Charge){
                        character.second_ability.possibilities = true
                    }
                },
                cost: 3,
                ascend: 16,
                desc: 'if you hit 3 or more enemies by charge ability you have a chance to get resourse'
            },
            {
                name: 'blood harvest',
                type: 'whirlwind',
                canUse: (character: Character) => {
                    return character.third_ability instanceof Whirlwind && !character.third_ability.blood_harvest
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof Whirlwind){
                        character.third_ability.blood_harvest = true
                    }
                },
                cost: 8,
                ascend: 30,
                desc: 'after using whirlwind you have a chance to create blood sphere'
            },
            {
                name: 'fan of swords',
                type: 'whirlwind',
                canUse: (character: Character) => {
                    return character.third_ability instanceof Whirlwind && !character.third_ability.fan_of_swords
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof Whirlwind){
                        character.third_ability.fan_of_swords = true
                    }
                },
                cost: 10,
                ascend: 40,
                desc: 'your whirlwind now fires fan of swords, inproves of weapon throw ability also works'
            },
            {
                name: 'consequences',
                type: 'quake',
                canUse: (character: Character) => {
                    return character.third_ability instanceof Quake && !character.third_ability.consequences
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof Quake){
                        character.third_ability.consequences = true
                    }
                },
                cost: 8,
                ascend: 26,
                desc: 'quake has a biger radius but incresed weakness duration'
            },
            {
                name: 'blast',
                type: 'quake',
                canUse: (character: Character) => {
                    return character.third_ability instanceof Quake && !character.third_ability.blasted
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof Quake){
                        character.third_ability.blasted = true
                    }
                },
                cost: 8,
                ascend: 35,
                desc: 'gives a chance to instant kill'
            },
            {
                name: 'selfcare',
                type: 'quake',
                canUse: (character: Character) => {
                    return character.third_ability instanceof Quake && !character.third_ability.selfcare
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof Quake){
                        character.third_ability.selfcare = true
                    }
                },
                cost: 4,
                ascend: 10,
                desc: 'your quake ability does not deal damage to you'
            },
        
            {
                name: 'drinker',
                type: 'cursed weapon',
                canUse: (character: Character) => {
                    return character.utility instanceof CursedWeapon && !character.utility.drinker
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof CursedWeapon){
                        character.utility.drinker = true
                    }
                },
                cost: 4,
                ascend: 10,
                desc: 'while you are affected by cursed weapon you have a chance to restore life after killing enemy'
            },
            {
                name: 'fast commands',
                type: 'commands',
                canUse: (character: Character) => {
                    return character.utility instanceof Commands && !character.utility.fast_commands
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof Commands){
                        character.utility.fast_commands = true
                    }
                },
                cost: 3,
                ascend: 16,
                desc: 'buff becomes shorter but stronger'
            },
            {
                name: 'shattered weapon',
                type: 'new ability',
                canUse: (character: Character) => {
                    return !(character.second_ability instanceof ShatteredWeapon)
                },
                teach: (character: Character) => {
                    if(character instanceof Swordman){
                        character.second_ability = new ShatteredWeapon(character)
                        character.updateClientSkill()
                    }
                },
                cost: 6,
                ascend: 12,
                desc: 'fires a magic fragments of your weapon when it hits walls or enemies it will returns and increases your armour rate'
            },
            {
                name: 'searching weapon',
                canUse: (character: Character) => {
                    return character.attack_radius < 10
                },
                teach: (character: Character) => {
                    if(character instanceof Swordman){
                        character.attack_radius ++
                    }
                },
                cost: 4,
                ascend: 8,
                desc: 'increases attack range'
            },
            {
                name: 'attack speed',
                canUse: (character: Character) => {
                    return character.attack_speed > 1000
                },
                teach: (character: Character) => {
                    if(character instanceof Swordman){
                        character.attack_speed -= 40
                    }
                },
                cost: 4,
                desc: 'increases attack speed'
            },
            {
                name: 'heaven vengeance',
                type: 'new ability',
                canUse: (character: Character) => {
                    return !(character.first_ability instanceof HeavenVengeance)
                },
                teach: (character: Character) => {
                    if(character instanceof Swordman){
                        character.first_ability = new HeavenVengeance(character)
                        character.updateClientSkill()
                    }
                },
                cost: 6,
                ascend: 10,
                desc: 'hits one enemy and strikes nearby enemies with lightning'
            },
            {
                name: 'eye for eye',
                type: 'heaven vengeance',
                canUse: (character: Character) => {
                    return character.first_ability instanceof HeavenVengeance && !character.first_ability.eye
                },
                teach: (character: Character) => {
                    if(character instanceof Swordman && character.first_ability instanceof HeavenVengeance){
                        character.first_ability.eye = true
                    }
                },
                cost: 5,
                ascend: 12,
                desc: 'increases radius of serching targets by your courage'
            },
            {
                name: 'heaven grace',
                type: 'heaven vengeance',
                canUse: (character: Character) => {
                    return character.first_ability instanceof HeavenVengeance && !character.first_ability.grace
                },
                teach: (character: Character) => {
                    if(character instanceof Swordman && character.first_ability instanceof HeavenVengeance){
                        character.first_ability.grace = true
                        character.triggers_on_get_hit.push(character.first_ability)
                    }
                },
                cost: 5,
                ascend: 8,
                desc: 'gives a chance when hit to clear skill cd'
            },
            {
                name: 'emergency orders',
                canUse: (character: Character) => {
                    return !character.triggers_on_say.some(elem => elem instanceof EmergencyOrdersTrigger)
                },
                teach: (character: Character) => {
                    character.triggers_on_say.push(new EmergencyOrdersTrigger())
                },
                cost: 3,
                ascend: 16,
                desc: 'when you speak can apply command ability buff'
            },
            {
                name: 'blocking technique',
                canUse: (character: Character) => {
                    return !character.triggers_on_block.some(elem => elem instanceof BlockingTechnique)
                },
                teach: (character: Character) => {
                    character.triggers_on_block.push(new BlockingTechnique())
                },
                cost: 5,
                ascend: 20,
                desc: 'when you block 5 hits the next three will be successfully blocked'
            },
            {
                name: 'electrified dash',
                type: 'dash',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Dash && !character.first_ability.electrified
                },
                teach: (character: Character) => {
                    if(character.first_ability instanceof Dash){
                        character.first_ability.electrified = true
                    }
                },
                cost: 8,
                ascend: 25,
                desc: 'dash now realises lightning when travel end number of which depends on hitted targets'
            },
            {
                name: 'pointed spines',
                type: 'metal thorns',
                canUse: (character: Character) => {
                    return character.second_ability instanceof MetalThorns && !character.second_ability.pointed
                },
                teach: (character: Character) => {
                    if(character.second_ability instanceof MetalThorns){
                        character.second_ability.pointed = true
                    }
                },
                cost: 6,
                ascend: 15,
                desc: 'metal thorns penetrates enemies when hit'
            },
            {
                name: 'call of arms',
                type: 'spectral swords',
                canUse: (character: Character) => {
                    return character.third_ability instanceof SpectralSwords && !character.third_ability.call
                },
                teach: (character: Character) => {
                    if(character.third_ability instanceof SpectralSwords){
                        character.third_ability.call = true
                    }
                },
                cost: 8,
                ascend: 30,
                desc: 'increases number of swords and their speed'
            },
        ]
    }   
}