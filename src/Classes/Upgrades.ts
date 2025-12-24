import Character from '../Objects/src/Character'
import Upgrade from '../Types/Upgrade'
import Touch from '../Status/Touch'
import WithColdStatus from '../Status/WithColdStatus'
import WithFireStatus from '../Status/WithFireStatus'
import WithStormStatus from '../Status/WithStormStatus'
import BlessedArmour from '../Status/BlessedArmour'
import Func from '../Func'
import CallWarriorWhenBlock from '../Triggers/CallWarriorWhenBlock'
import SoulShatter from '../Abilities/Cultist/SoulShatter'
import BurningCircle from '../Abilities/Cultist/BurningCircle'
import Rune from '../Abilities/Cultist/Rune'
import Cultist from '../Objects/src/PlayerClasses/Cultist'
import Slam from '../Abilities/Cultist/Slam'
import ShieldBash from '../Abilities/Cultist/ShieldBash'
import GrimPile from '../Abilities/Cultist/GrimPile'
import UnleashPain from '../Abilities/Cultist/UnleashPain'
import PileOfThornCast from '../Abilities/Cultist/PileOfThornCast'
import SelfFlagellation from '../Abilities/Cultist/SelfFlagellation'
import GhostForm from '../Abilities/Cultist/GhostForm'
import AnnihilatorBeam from '../Abilities/Flyer/AnnihilatorBeam'
import Teeth from '../Abilities/Flyer/Teeth'
import FlameWall from '../Abilities/Flyer/FlameWall'
import Flyer from '../Objects/src/PlayerClasses/Flyer'
import Fireball from '../Abilities/Flyer/Fireball'
import FrostSphere from '../Abilities/Flyer/FrostSphere'
import LightningBolt from '../Abilities/Flyer/LightningBolt'
import ForkedLightning from '../Abilities/Flyer/ForkedLightning'
import LightBeacon from '../Abilities/Flyer/LightBeacon'
import Frostnova from '../Abilities/Flyer/Frostnova'
import StaticField from '../Abilities/Flyer/StaticField'
import Teleportation from '../Abilities/Flyer/Teleportation'
import Sparks from '../Abilities/Flyer/Sparks'
import ShatteredWeapon from '../Abilities/Swordman/ShatteredWeapon'
import BlockingTechnique from '../Triggers/ BlockingTechnique'
import HeavenVengeance from '../Abilities/Swordman/HeavenVengeance'
import EmergencyOrdersTrigger from '../Triggers/EmergencyOrdersTrigger'
import WeaponSwing from '../Abilities/Swordman/WeaponSwing'
import WeaponThrow from '../Abilities/Swordman/WeaponThrow'
import Jump from '../Abilities/Swordman/Jump'
import Charge from '../Abilities/Swordman/Charge'
import Whirlwind from '../Abilities/Swordman/Whirlwind'
import Quake from '../Abilities/Swordman/Quake'
import CursedWeapon from '../Abilities/Swordman/CursedWeapon'
import Commands from '../Abilities/Swordman/Commands'
import Swordman from '../Objects/src/PlayerClasses/Swordman'
import MetalThorns from '../Abilities/Swordman/MetalThorns'
import Dash from '../Abilities/Swordman/Dash'
import SpectralSwords from '../Abilities/Swordman/SpectralSwords'
import Soulrender from '../Abilities/Cultist/Soulrender'
import Redemption from '../Status/Redemption'
import FleshHarvest from '../Status/FleshHarvest'
import WardAfterEnlightTrigger from '../Triggers/WardAfterEnlightTrigger'
import DivineWeaponTrigger from '../Triggers/DivineWeaponTrigger'
import UnhumanFortitudeTrigger from '../Triggers/UnhumanFortitudeTrigger'
import MassiveImpactTrigger from '../Triggers/MassiveImpactTrigger'
import InspirationTrigger from '../Triggers/InspirationTrigger'
import Creator from '../Status/Creator'
import DamageInRadiusWhenEnlightnent from '../Triggers/DamageInRadiusWhenEnlightnent'
import InnerPowerTrigger from '../Triggers/InnerPowerTrigger'
import Luck from '../Status/Luck'
import Forging from '../Items/Forgings/Forging'
import MagicFlowTrigger from '../Triggers/MagicFlowTrigger'
import RisingMoraleTrigger from '../Triggers/RisingMoraleTrigger'
import CrushingWave from '../Status/CrushingWave'
import FromDefendToAttackTrigger from '../Triggers/FromDefendToAttackTrigger'
import WallOfWillTrigger from '../Triggers/WallOfWillTrigger'
import FirstToStrikeTrigger from '../Triggers/FirstToStrikeTrigger'
import PressingSteps from '../Status/PressingSteps'
import ScreamTrigger from '../Triggers/ScreamTrigger'
import ImpactTrigger from '../Triggers/ImpactTrigger'
import CuttingMutator from '../Mutators/CuttingMutator'
import AnnihilationMutator from '../Mutators/AnnihilationMutator'
import CourageAvoidDamage from '../Mutators/CourageAvoidDamage'
import FocusingMutator from '../Mutators/FocusingMutator'
import BlessedWarrioraArmourMutator from '../Mutators/BlessedWarrioraArmourMutator'
import BlessedWarriorPierceMutator from '../Mutators/BlessedWarriorPierceMutator'
import SpiritStrikes from '../Triggers/SpiritStrikes'
import SpiritStrikesMutator from '../Mutators/SpiritStrikesMutator'

export default class Upgrades {
    static getAllUpgrades(): Upgrade[] {
        return [
             {
                name: 'equiped',
                canUse: (character: Character) => {
                    return character.item.length >=5
                },
                teach: (character: Character): void => {
                    character.pierce += 15
                    character.armour_rate += 15
                },
                cost: 2,
                ascend: 25,
                desc: 'If you have more that 5 items, get 15 armour and pierce rating',
            },
            {
                name: 'senselessness',
                canUse: (character: Character) => {
                    return !character.avaid_damage_mutator.some(elem => elem instanceof CourageAvoidDamage)
                },
                teach: (character: Character): void => {
                    character.avaid_damage_mutator.push(new CourageAvoidDamage())
                },
                cost: 3,
                ascend: 30,
                desc: 'Increases chance to avoid damage depend on your courage',
            },
            {
                name: 'immaterial',
                canUse: (character: Character) => {
                    return character.avoid_damage_chance < 20
                },
                teach: (character: Character): void => {
                    character.avoid_damage_chance += 1
                },
                cost: 1,
                ascend: 25,
                desc: 'Increases chance to avoid damage',
            },
            {
                name: 'overflow',
                canUse: (character: Character) => {
                    return !character.triggers_on_enlight.some(
                        elem => elem instanceof DamageInRadiusWhenEnlightnent
                    )
                },
                teach: (character: Character): void => {
                    character.triggers_on_enlight.push(new DamageInRadiusWhenEnlightnent())
                },
                cost: 2,
                ascend: 14,
                desc: 'When you gain enlightenment, you deal damage in a large radius equlas your courage',
            },
            {
                name: 'way of enlightenment',
                canUse: (character: Character) => {
                    return character.enlightenment_threshold >= 6
                },
                teach: (character: Character): void => {
                    character.enlightenment_threshold--
                },
                cost: 2,
                ascend: 20,
                desc: 'Reduces the amount of courage required to achieve enlightenment',
            },
            {
                name: 'creator',
                canUse: (character: Character) => {
                    return !character.level.status_pull.find(
                        elem => elem.unit === character && elem instanceof Creator
                    )
                },
                teach: (character: Character): void => {
                    character.level.setStatus(character, new Creator(character.level.time))
                },
                cost: 3,
                ascend: 26,
                desc: 'You can create a sphere around yourself',
            },
            {
                name: 'metabolism',
                canUse: (character: Character) => {
                    return character.base_regeneration_time > 5000
                },
                teach: (character: Character): void => {
                    character.base_regeneration_time -= 500
                },
                cost: 1,
                ascend: 12,
                desc: 'Increases your life regeneration rate',
            },
            {
                name: 'masterliness',
                canUse: (character: Character) => {
                    return Func.chance(30) && character.third_ability.mastery_chance <= 100
                },
                teach: (character: Character): void => {
                    character.first_ability.mastery_chance += 1
                    character.second_ability.mastery_chance += 5
                    character.third_ability.mastery_chance += 10
                    character.utility.mastery_chance += 5
                },
                cost: 2,
                ascend: 20,
                desc: 'Increases the chance of mastery proc in your skills',
            },
            {
                name: 'pressing steps',
                canUse: (character: Character) => {
                    return (
                        !character.level.status_pull.find(
                            elem => elem.unit === character && elem instanceof PressingSteps
                        ) && character.power >= 20
                    )
                },
                teach: (character: Character): void => {
                    character.level.setStatus(character, new PressingSteps(character.level.time))
                },
                cost: 5,
                ascend: 60,
                desc: 'If you move for 3 seconds, you begin to deal damage to nearby enemies',
            },
            {
                name: 'from defense to attack',
                canUse: (character: Character) => {
                    return !character.triggers_on_block.some(
                        elem => elem instanceof FromDefendToAttackTrigger
                    )
                },
                teach: (character: Character): void => {
                    character.triggers_on_block.push(new FromDefendToAttackTrigger())
                },
                cost: 2,
                ascend: 12,
                desc: 'When you block, you have a chance to increase your power',
            },
            {
                name: 'wall of will',
                canUse: (character: Character) => {
                    return (
                        !character.triggers_on_block.some(
                            elem => elem instanceof WallOfWillTrigger
                        ) && !(character instanceof Flyer)
                    )
                },
                teach: (character: Character): void => {
                    character.triggers_on_block.push(new WallOfWillTrigger())
                },
                cost: 3,
                ascend: 20,
                desc: 'When you block, you have a chance to increase your block chance',
            },
            {
                name: 'cutting',
                canUse: (character: Character) => {
                    return (
                        !character.pierce_rating_mutators.some(
                            elem => elem instanceof CuttingMutator
                        )
                    )
                },
                teach: (character: Character): void => {
                    character.pierce_rating_mutators.push(new CuttingMutator())
                },
                cost: 2,
                ascend: 20,
                desc: 'Pierce rating increased by courage',
            },
            {
                name: 'annihilation',
                canUse: (character: Character) => {
                    return (
                        !character.critical_rating_mutators.some(
                            elem => elem instanceof AnnihilationMutator
                        )
                    )
                },
                teach: (character: Character): void => {
                    character.critical_rating_mutators.push(new AnnihilationMutator())
                },
                cost: 2,
                ascend: 20,
                desc: 'Critical rating increased by energy',
            },
            {
                name: 'power',
                canUse: (character: Character) => {
                    return character.power < 100
                },
                teach: (character: Character): void => {
                    character.power++
                },
                cost: 1,
                ascend: 12,
                desc: 'Increases your power',
            },
            {
                name: 'overpower',
                canUse: (character: Character) => {
                    return character.power > 30
                },
                teach: (character: Character): void => {
                    character.critical += 3
                    character.impact += 3
                    character.crushing += 3
                },
                cost: 2,
                ascend: 20,
                desc: 'Increases your critical, impact, crushing rating',
            },
            {
                name: 'first to strike',
                canUse: (character: Character) => {
                    return !character.triggers_on_block.some(
                        elem => elem instanceof FirstToStrikeTrigger
                    )
                },
                teach: (character: Character): void => {
                    character.triggers_on_block.push(new FirstToStrikeTrigger())
                },
                cost: 2,
                ascend: 10,
                desc: 'When you block, you have a chance to increase your attack and cast speed',
            },
            {
                name: 'divine forging',
                canUse: (character: Character) => {
                    return character.item.length > 0
                },
                teach: (character: Character): void => {
                    let item = Func.getRandomFromArray(character.item)

                    if (item) {
                        item.max_forgings++

                        let forging: Forging = Func.getRandomFromArray(
                            item.forge.filter(elem => elem.canBeForged())
                        )

                        if (forging) {
                            character.gold += forging.gold_cost
                            forging.forge(character)
                        }

                        let new_forge = item.getRandomForging()

                        while (
                            item.suggested_forgings.some(
                                elem => elem instanceof new_forge.constructor
                            )
                        ) {
                            new_forge = item.getRandomForging()
                        }

                        character.gold += new_forge.gold_cost

                        new_forge.forge(character)

                        item.forge.push(new_forge)
                    }
                },
                cost: 3,
                ascend: 30,
                desc: 'Your random item gains a new forge, upgrades a random forge and increasing the maximum number of forges',
            },
            {
                name: 'best day',
                canUse: (character: Character) => {
                    return !character.after_grace_statuses.some(elem => elem instanceof Luck)
                },
                teach: (character: Character): void => {
                    let status = new Luck(character.level.time)
                    status.setDuration(30000)
                    character.after_grace_statuses.push(status)
                },
                cost: 2,
                ascend: 12,
                desc: 'You become lucky for 30 seconds',
            },
            {
                name: 'crushing wave',
                canUse: (character: Character) => {
                    return (
                        character.crushing_rating >= 30 &&
                        !character.level.status_pull.some(elem => elem instanceof CrushingWave)
                    )
                },
                teach: (character: Character): void => {
                    let s = new CrushingWave(character.level.time)

                    character.level.setStatus(character, s)
                },
                cost: 3,
                ascend: 26,
                desc: 'Every 2 seconds, nearby crushed enemies take damage',
            },
            {
                name: 'bravery',
                canUse: (character: Character) => {
                    return character.courage_expire_timer <= 15000
                },
                teach: (character: Character): void => {
                    character.courage_expire_timer += 2000
                },
                cost: 2,
                ascend: 10,
                desc: 'Your courage expires slower',
            },
            {
                name: 'forger',
                canUse: (character: Character) => {
                    return character.chance_to_additional_carved_spark <= 50
                },
                teach: (character: Character): void => {
                    character.chance_to_additional_carved_spark += 25
                },
                cost: 2,
                ascend: 14,
                desc: 'Gives a chance to get additional carved spark',
            },
            {
                name: 'blessed fighter',
                canUse: (character: Character) => {
                    return !character.armour_mutators.some(elem => {
                        return elem instanceof BlessedWarrioraArmourMutator
                    })
                },
                teach: (character: Character): void => {
                    character.armour_mutators.push( new BlessedWarrioraArmourMutator())
                    character.pierce_rating_mutators.push( new BlessedWarriorPierceMutator())
                },
                cost: 3,
                ascend: 25,
                desc: 'If you are blessed(life more that maximum), you have additional armour and pierce rating',
            },
            {
                name: 'divine pack',
                canUse: (character: Character) => {
                    return character.max_items < 8
                },
                teach: (character: Character): void => {
                    character.max_items++
                    character.purchased_items--
                },
                cost: 2,
                ascend: 30,
                desc: 'Gives additional item slot',
            },
            {
                name: 'inspiration',
                canUse: (character: Character) => {
                    return (
                        !character.triggers_on_get_energy.some(
                            elem => elem instanceof InspirationTrigger
                        ) && character.perception >= 8
                    )
                },
                teach: (character: Character): void => {
                    character.triggers_on_get_energy.push(new InspirationTrigger())
                },
                cost: 4,
                ascend: 20,
                desc: 'gives a chance depending on your perception get maximum energy when you get energy',
            },
            {
                name: 'massive impact',
                canUse: (character: Character) => {
                    return (
                        character.impact >= 20 &&
                        !character.triggers_on_impact.some(
                            elem => elem instanceof MassiveImpactTrigger
                        )
                    )
                },
                teach: (character: Character): void => {
                    character.triggers_on_impact.push(new MassiveImpactTrigger())
                },
                cost: 3,
                ascend: 14,
                desc: 'Gives a chance, depending on your might to create additional impacts',
            },
            {
                name: 'focusing',
                canUse: (character: Character) => {
                    return (
                        !character.armour_mutators.some(
                            elem => elem instanceof FocusingMutator
                        )
                    )
                },
                teach: (character: Character): void => {
                    character.armour_mutators.push(new FocusingMutator())
                },
                cost: 3,
                ascend: 14,
                desc: 'Courage also increases your armour',
            },         
            {
                name: 'impactor',
                canUse: (character: Character) => {
                    return (
                        character.impact >= 10 &&
                        character.impact_radius < 16
                    )
                },
                teach: (character: Character): void => {
                    character.impact_radius += 2
                    character.impact ++
                    let t = character.triggers_on_hit.find(elem => elem instanceof ImpactTrigger)
                    if(t){
                        t.cd -= 150
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'Increases impact radius and reduces cd',
            },
            {
                name: 'divine weapon',
                canUse: (character: Character) => {
                    return (
                        character.will >= 10 &&
                        !character.triggers_on_hit.some(elem => elem instanceof DivineWeaponTrigger)
                    )
                },
                teach: (character: Character): void => {
                    character.triggers_on_hit.push(new DivineWeaponTrigger())
                },
                cost: 3,
                ascend: 20,
                desc: 'Gives a chance, depending on your will to rain down pillars of light on enemies when you hit',
            },
            {
                name: 'unhuman fortitude',
                canUse: (character: Character) => {
                    return (
                        character.durability >= 10 &&
                        !character.triggers_on_get_hit.some(
                            elem => elem instanceof UnhumanFortitudeTrigger
                        )
                    )
                },
                teach: (character: Character): void => {
                    character.triggers_on_get_hit.push(new UnhumanFortitudeTrigger())
                },
                cost: 3,
                ascend: 20,
                desc: 'Grants a 30% chance to gain fortification equal to your durability when taking damage',
            },
            {
                name: 'ressurection',
                canUse: (character: Character) => {
                    return !character.can_ressurect
                },
                teach: (character: Character): void => {
                    character.can_ressurect = true
                },
                cost: 7,
                ascend: 30,
                desc: 'Returns you after dead',
            },
            {
                name: 'with storm',
                type: 'status',
                canUse: (character: Character) => {
                    return !character.level.status_pull.find(
                        elem => elem.unit === character && elem instanceof WithStormStatus
                    )
                },
                teach: (character: Character): void => {
                    let status = new WithStormStatus(character.level.time)
                    status.setPower(0)
                    character.level.setStatus(character, status, true)
                },
                cost: 2,
                ascend: 10,
                desc: 'Creates lightning periodically which shocks enemies',
            },
            {
                name: 'move speed',
                canUse: (character: Character) => {
                    return true
                },
                teach: (character: Character): void => {
                    character.move_speed_penalty += 2
                },
                cost: 3,
                ascend: 20,
                desc: 'Increases move speed',
            },
            {
                name: 'vampiric strikes',
                canUse: (character: Character) => {
                    return true
                },
                teach: (character: Character): void => {
                    character.vampiric_rate += 2
                },
                cost: 2,
                ascend: 10,
                desc: 'Increases you vampiric rate',
            },
            {
                name: 'lightning reflexes',
                canUse: (character: Character) => {
                    return character.agility >= 10
                },
                teach: (character: Character): void => {
                    character.armour_rate += 10
                },
                cost: 4,
                ascend: 20,
                desc: 'Increases your armour by 10',
            },
            {
                name: 'moment replication',
                canUse: (character: Character) => {
                    return character.chance_to_trigger_additional_time <= 30
                },
                teach: (character: Character) => {
                    character.chance_to_trigger_additional_time += 5
                },
                cost: 2,
                ascend: 15,
                desc: 'Gives a chance that a trigger triggered twice',
            },
            {
                name: 'titanic strikes',
                canUse: (character: Character) => {
                    return character.might >= 7 && character.impact < 100
                },
                teach: (character: Character): void => {
                    character.impact += 20
                },
                cost: 3,
                ascend: 25,
                desc: 'Increases your impact rating by 20',
            },
            {
                name: 'clear mind',
                canUse: (character: Character) => {
                    return character.knowledge >= 10 && character.cooldown_redaction < 100
                },
                teach: (character: Character): void => {
                    character.cooldown_redaction += 15
                },
                cost: 5,
                ascend: 20,
                desc: 'Increases your cooldowns redaction by 15',
            },
            {
                name: 'afterlight',
                canUse: (character: Character) => {
                    return !character.triggers_on_enlight.some(
                        elem => elem instanceof WardAfterEnlightTrigger
                    )
                },
                teach: (character: Character): void => {
                    character.triggers_on_enlight.push(new WardAfterEnlightTrigger())
                },
                cost: 4,
                ascend: 25,
                desc: 'You gain wards equals your courage when you gain enlightenment',
            },
            {
                name: 'spirit strikes',
                canUse: (character: Character) => {
                    return !character.triggers_on_impact.some(elem => elem instanceof SpiritStrikes) && character.will >= 6
                },
                teach: (character: Character): void => {
                    character.triggers_on_impact.push(new SpiritStrikes())
                    character.impact_mutators.push(new SpiritStrikesMutator())
                },
                cost: 2,
                ascend: 16,
                desc: 'Impact rating increased by your amount of ward, then you impact there is a chance to get ward',
            },
            {
                name: 'immune to freeze',
                canUse: (character: Character) => {
                    return !character.immune_to_freeze
                },
                teach: (character: Character): void => {
                    character.immune_to_freeze = true
                },
                cost: 10,
                ascend: 50,
                desc: 'Immune to freeze',
            },
            {
                name: 'ascending',
                canUse: (character: Character) => {
                    return character.ascend_level <= 25
                },
                teach: (character: Character): void => {
                    character.addAscent(4)
                },
                cost: 3,
                ascend: 5,
                desc: 'Icreases you ascension by 5',
            },
            {
                name: 'with fire',
                type: 'status',
                canUse: (character: Character) => {
                    return !character.level.status_pull.find(
                        elem => elem.unit === character && elem instanceof WithFireStatus
                    )
                },
                teach: (character: Character) => {
                    let status = new WithFireStatus(character.level.time)
                    status.setPower(0)
                    character.level.setStatus(character, status, true)
                },
                cost: 2,
                ascend: 12,
                desc: 'Creates a flame that periodically burns everything around it',
            },
            {
                name: 'with cold',
                type: 'status',
                canUse: (character: Character) => {
                    return !character.level.status_pull.find(
                        elem => elem.unit === character && elem instanceof WithColdStatus
                    )
                },
                teach: (character: Character) => {
                    let status = new WithColdStatus(character.level.time)
                    status.setPower(0)
                    character.level.setStatus(character, status, true)
                },
                cost: 2,
                ascend: 18,
                desc: 'Periodically creates a cold blast that freezes enemies and players',
            },
            {
                name: 'increase perception',
                canUse: (character: Character) => {
                    return character.perception != undefined
                },
                teach: (character: Character) => {
                    character.perception++
                },
                cost: 1,
                desc: 'Increases your perception',
            },
            {
                name: 'increase knowledge',
                canUse: (character: Character) => {
                    return character.knowledge != undefined
                },
                teach: (character: Character) => {
                    character.knowledge++
                },
                cost: 1,
                desc: 'Increases your knowledge',
            },
            {
                name: 'increase might',
                canUse: (character: Character) => {
                    return character.might != undefined
                },
                teach: (character: Character) => {
                    character.might++
                },
                cost: 1,
                desc: 'Increases your might',
            },
            {
                name: 'increase durability',
                canUse: (character: Character) => {
                    return character.durability != undefined
                },
                teach: (character: Character) => {
                    character.durability++
                },
                cost: 1,
                desc: 'Increases your durability',
            },
            {
                name: 'increase will',
                canUse: (character: Character) => {
                    return character.will != undefined
                },
                teach: (character: Character) => {
                    character.will++
                },
                cost: 1,
                desc: 'Increases your will',
            },
            {
                name: 'increase agility',
                canUse: (character: Character) => {
                    return character.agility != undefined
                },
                teach: (character: Character) => {
                    character.agility++
                },
                cost: 1,
                desc: 'Increases your agility',
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
                desc: 'Restore your life',
            },
            {
                name: 'chosen one',
                canUse: (character: Character) => {
                    return character.chance_to_create_grace < 50
                },
                teach: (character: Character) => {
                    character.chance_to_create_grace += 5
                },
                cost: 3,
                ascend: 16,
                desc: `Icreases your chance to gain grace after an enemy's death`,
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
                ascend: 16,
                desc: 'Undead creatures you kill have a reduced chance of resurrecting',
            },
            {
                name: 'pierce',
                canUse: (character: Character) => {
                    return true
                },
                teach: (character: Character) => {
                    character.pierce += 2
                },
                cost: 1,
                desc: 'Increases pierce rating',
            },
            {
                name: 'critical hit',
                canUse: (character: Character) => {
                    return character.critical < 100
                },
                teach: (character: Character) => {
                    character.critical += 2
                },
                cost: 1,
                desc: 'Increases chance to deal double damage',
            },
            {
                name: 'armour',
                canUse: (character: Character) => {
                    return true
                },
                teach: (character: Character) => {
                    character.armour_rate += 3
                },
                cost: 2,
                desc: 'Increases your armour',
            },
            {
                name: 'gamble',
                canUse: (character: Character) => {
                    return character.grace >= 1 && Func.chance(20)
                },
                teach: (character: Character) => {
                    if (Func.chance(50, character.is_lucky)) {
                        character.grace *= 2
                    } else {
                        character.grace = Math.floor(character.grace / 2)
                    }
                },
                cost: 0,
                desc: 'Lose or win',
            },
            {
                name: 'resist',
                canUse: (character: Character) => {
                    return character.status_resistance < 80
                },
                teach: (character: Character) => {
                    character.status_resistance += 2
                },
                cost: 1,
                desc: 'Increases your resist',
            },
            {
                name: 'lust for life',
                canUse: (character: Character) => {
                    return !character.lust_for_life
                },
                teach: (character: Character) => {
                    character.lust_for_life = true
                },
                cost: 3,
                ascend: 20,
                desc: 'Gives you a chance, based on your courage, to restore life more than the maximum',
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
                desc: 'Increases your light radius',
            },
            {
                name: 'touch',
                type: 'buff',
                canUse: (character: Character) => {
                    return (
                        character.after_grace_statuses.filter(elem => elem.name === 'touch')
                            .length === 0
                    )
                },
                teach: (character: Character) => {
                    let status = new Touch(character.level.time)
                    status.setDuration(40000)
                    character.after_grace_statuses.push(status)
                },
                cost: 1,
                ascend: 20,
                desc: 'Grants a buff upon exiting a portal that increases all your stats by 10',
            },
            {
                name: 'blessed armour',
                type: 'buff',
                canUse: (character: Character) => {
                    return (
                        character.after_grace_statuses.filter(
                            elem => elem.name === 'blessed armour'
                        ).length === 0
                    )
                },
                teach: (character: Character) => {
                    let status = new BlessedArmour(character.level.time)
                    status.setDuration(30000)
                    character.after_grace_statuses.push(status)
                },
                cost: 1,
                ascend: 10,
                desc: 'Grants a buff upon exiting a portal that give armour to you and your allies',
            },
            {
                name: 'scream',
                canUse: (character: Character) => {
                    return (
                        character.chance_to_say_phrase >= 2 &&
                        !character.triggers_on_say.some(elem => elem instanceof ScreamTrigger)
                    )
                },
                teach: (character: Character) => {
                    character.triggers_on_say.push(new ScreamTrigger())
                },
                cost: 2,
                ascend: 20,
                desc: 'Nearby enemies get damage when you speak',
            },
            {
                name: 'talkativeness',
                canUse: (character: Character) => {
                    return character.chance_to_say_phrase < 8 && Func.chance(20)
                },
                teach: (character: Character) => {
                    character.chance_to_say_phrase++
                },
                cost: 2,
                ascend: 12,
                desc: 'Increases a chance to say something',
            },
            {
                name: 'swiftness',
                canUse: (character: Character) => {
                    return character.cooldown_redaction < 90
                },
                teach: (character: Character) => {
                    character.cooldown_redaction += 2
                },
                cost: 3,
                ascend: 16,
                desc: 'Reduces cooldowns',
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
                desc: 'Gives you 3 ward',
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
                desc: 'Gives you 10 ward',
            },
            {
                name: 'redemption',
                canUse: (character: Character) => {
                    return !character.level.status_pull.find(
                        elem => elem.unit === character && elem instanceof Redemption
                    )
                },
                teach: (character: Character) => {
                    let s = new Redemption(character.level.time)

                    character.level.setStatus(character, s)
                },
                cost: 6,
                ascend: 40,
                desc: 'Consumes a corpse to create sphere',
            },
            {
                name: 'flesh harvest',
                canUse: (character: Character) => {
                    return !character.level.status_pull.find(
                        elem => elem.unit === character && elem instanceof FleshHarvest
                    )
                },
                teach: (character: Character) => {
                    let s = new FleshHarvest(character.level.time)

                    character.level.setStatus(character, s)
                },
                cost: 6,
                ascend: 35,
                desc: 'Consumes a corpse to heal you',
            },
            {
                name: 'discipline',
                canUse: (character: Character) => {
                    return character.maximum_resources < 12
                },
                teach: (character: Character) => {
                    if (character instanceof Character) {
                        character.maximum_resources++
                    }
                },
                cost: 3,
                ascend: 18,
                desc: 'Increases your maximum of energy',
            },
            {
                name: 'impact',
                canUse: (character: Character) => {
                    return character.impact < 100
                },
                teach: (character: Character) => {
                    if (character instanceof Character) {
                        character.impact++
                    }
                },
                cost: 1,
                ascend: 6,
                desc: 'Increases impact rating',
            },
            {
                name: 'crushing',
                canUse: (character: Character) => {
                    return character.crushing_rating < 100
                },
                teach: (character: Character) => {
                    character.crushing_rating++
                },
                cost: 1,
                ascend: 8,
                desc: 'Increases crushing rating',
            },
            {
                name: 'raising morale',
                canUse: (character: Character) => {
                    return (
                        !character.triggers_on_say.some(
                            elem => elem instanceof RisingMoraleTrigger
                        ) && character.chance_to_say_phrase >= 2
                    )
                },
                teach: (character: Character) => {
                    character.triggers_on_say.push(new RisingMoraleTrigger())
                },
                cost: 2,
                ascend: 20,
                desc: 'When you speak, there is a chance to heal yourself and your allies',
            },
            {
                name: 'spirit',
                canUse: (character: Character) => {
                    return character.spirit < 90
                },
                teach: (character: Character) => {
                    character.spirit++
                },
                cost: 1,
                ascend: 10,
                desc: 'Increases your spirit',
            },
            {
                name: 'shout',
                canUse: (character: Character) => {
                    return character.level.players.length > 1 && character.chance_to_say_phrase >= 2
                },
                teach: (character: Character) => {
                    character.voice_radius += 10
                },
                cost: 2,
                ascend: 6,
                desc: 'Increases the radius of your phrases',
            },
        ]
    }
    static getCultistUpgrades() {
        return [
            {
                name: 'runefield',
                type: 'rune',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Rune &&
                        !character.first_ability.runefield
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof Rune) {
                        character.first_ability.runefield = true
                        character.first_ability.cost += 1
                    }
                },
                cost: 3,
                ascend: 15,
                desc: 'You will create an additional rune for each energy, but it now costs 1 more',
            },
            {
                name: 'explosive runes',
                type: 'rune',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Rune &&
                        !character.first_ability.explosive
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof Rune) {
                        character.first_ability.explosive = true
                    }
                },
                cost: 2,
                ascend: 8,
                desc: 'Increases radius of explosion',
            },
            {
                name: 'fast detonation',
                type: 'rune',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Rune &&
                        !character.first_ability.fast_detonation
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof Rune) {
                        character.first_ability.fast_detonation = true
                    }
                },
                cost: 3,
                ascend: 20,
                desc: 'Increases detonation rate',
            },
            {
                name: 'second detanation',
                type: 'rune',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Rune &&
                        !character.first_ability.second_detanation
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof Rune) {
                        character.first_ability.second_detanation = true
                        character.first_ability.cost++
                    }
                },
                cost: 2,
                ascend: 25,
                desc: 'Your runes have a chance to explode additional time but it now costs 1 more',
            },
            {
                name: 'soul shatter',
                type: 'new ability',
                canUse: (character: Character) => {
                    return !(character.first_ability instanceof SoulShatter)
                },
                teach: (character: Character) => {
                    if (character instanceof Cultist) {
                        character.first_ability = new SoulShatter(character)
                        character.updateClientSkill()
                    }
                },
                cost: 2,
                ascend: 10,
                desc: 'Deals damage to a single target, if it dies there is a chance, souls are created, the number of which depends on courage',
            },
            {
                name: 'mark of darkness',
                type: 'soul shatter',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof SoulShatter &&
                        !character.first_ability.mark
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability instanceof SoulShatter) {
                        character.first_ability.mark = true
                    }
                },
                cost: 2,
                ascend: 20,
                desc: 'Always creates souls',
            },
            {
                name: 'slaming',
                type: 'slam',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Slam && !character.first_ability.slaming
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof Slam) {
                        character.first_ability.slaming = true
                    }
                },
                cost: 1,
                ascend: 6,
                desc: 'Increases the radius',
            },
            {
                name: 'soul extraction',
                type: 'slam',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Slam &&
                        !character.first_ability.soul_extraction
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof Slam) {
                        character.first_ability.soul_extraction = true
                    }
                },
                cost: 2,
                ascend: 20,
                desc: 'Increases the chance to gain grace from killing enemies',
            },
            {
                name: 'deafening wave',
                type: 'shield bash',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof ShieldBash &&
                        !character.second_ability.deafening_wave &&
                        !character.second_ability.hate
                    )
                },
                teach: (character: Character) => {
                    if (
                        character.second_ability &&
                        character.second_ability instanceof ShieldBash
                    ) {
                        character.second_ability.deafening_wave = true
                    }
                },
                cost: 2,
                ascend: 10,
                desc: 'Increases duration and radius of stunning',
            },
            {
                name: 'gore aegis',
                type: 'shield bash',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof ShieldBash &&
                        !character.second_ability.gore_aegis
                    )
                },
                teach: (character: Character) => {
                    if (
                        character.second_ability &&
                        character.second_ability instanceof ShieldBash
                    ) {
                        character.second_ability.gore_aegis = true
                    }
                },
                cost: 2,
                ascend: 16,
                desc: 'When you kill an enemy with a shield bash, you gain Gore Aegis',
            },
            {
                name: 'hate',
                type: 'shield bash',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof ShieldBash &&
                        !character.second_ability.deafening_wave &&
                        !character.second_ability.hate
                    )
                },
                teach: (character: Character) => {
                    if (
                        character.second_ability &&
                        character.second_ability instanceof ShieldBash
                    ) {
                        character.second_ability.hate = true
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'Your shield strike no longer stuns, but instead has a chance to shatter the enemy.',
            },
            {
                name: 'coordination',
                type: 'shield bash',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof ShieldBash &&
                        !character.second_ability.coordination
                    )
                },
                teach: (character: Character) => {
                    if (
                        character.second_ability &&
                        character.second_ability instanceof ShieldBash
                    ) {
                        character.second_ability.coordination = true
                    }
                },
                cost: 3,
                ascend: 8,
                desc: 'Gives a chance to reduce cooldown by 50%',
            },
            {
                name: 'increase grim pile effect',
                type: 'grim pile',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof GrimPile &&
                        !character.second_ability.increased_effect
                    )
                },
                teach: (character: Character) => {
                    if (character.second_ability && character.second_ability instanceof GrimPile) {
                        character.second_ability.increased_effect = true
                    }
                },
                cost: 1,
                desc: 'Increases armour and move speed that it gives',
            },
            {
                name: 'grim pile of will',
                type: 'grim pile',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof GrimPile &&
                        !character.second_ability.resistance
                    )
                },
                teach: (character: Character) => {
                    if (character.second_ability && character.second_ability instanceof GrimPile) {
                        character.second_ability.resistance = true
                    }
                },
                cost: 1,
                ascend: 18,
                desc: 'Now also increase resist',
            },
            {
                name: 'reign of pain',
                type: 'unleashing pain',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof UnleashPain &&
                        !character.third_ability.reign_of_pain
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability && character.third_ability instanceof UnleashPain) {
                        character.third_ability.reign_of_pain = true
                    }
                },
                cost: 1,
                ascend: 25,
                desc: 'Increases the enemy search radius and the number of warriors - increases with courage.',
            },
            {
                name: 'spreading',
                type: 'self flagellation',
                canUse: (character: Character) => {
                    return (
                        character.utility instanceof SelfFlagellation &&
                        !character.utility.spreading
                    )
                },
                teach: (character: Character) => {
                    if (character.utility && character.utility instanceof SelfFlagellation) {
                        character.utility.spreading = true
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'Deals damage in small radius to enemies',
            },
            {
                name: 'restless warriors',
                type: 'unleashing pain',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof UnleashPain &&
                        !character.third_ability.restless_warriors
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability && character.third_ability instanceof UnleashPain) {
                        character.third_ability.restless_warriors = true
                    }
                },
                cost: 2,
                ascend: 20,
                desc: 'Your ghost warriors make 2 hits',
            },
            {
                name: 'ring of pain',
                type: 'pile of thorns',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof PileOfThornCast &&
                        !character.third_ability.ring_of_pain
                    )
                },
                teach: (character: Character) => {
                    if (
                        character.third_ability &&
                        character.third_ability instanceof PileOfThornCast
                    ) {
                        character.third_ability.ring_of_pain = true
                    }
                },
                cost: 2,
                ascend: 16,
                desc: 'Increases radius and frequency',
            },
            {
                name: 'collection of bones',
                type: 'pile of thorns',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof PileOfThornCast &&
                        !character.third_ability.collection_of_bones
                    )
                },
                teach: (character: Character) => {
                    if (
                        character.third_ability &&
                        character.third_ability instanceof PileOfThornCast
                    ) {
                        character.third_ability.collection_of_bones = true
                    }
                },
                cost: 1,
                ascend: 16,
                desc: 'Upon expiration, releases bones for each enemy killed',
            },
            {
                name: 'pack with dead',
                type: 'self flagellation',
                canUse: (character: Character) => {
                    return character.utility instanceof SelfFlagellation && !character.utility.pack
                },
                teach: (character: Character) => {
                    if (character.utility && character.utility instanceof SelfFlagellation) {
                        character.utility.pack = true
                    }
                },
                cost: 1,
                ascend: 16,
                desc: 'You cannot die by using',
            },
            {
                name: 'lesson of pain',
                type: 'self flagellation',
                canUse: (character: Character) => {
                    return (
                        character.utility instanceof SelfFlagellation && !character.utility.lesson
                    )
                },
                teach: (character: Character) => {
                    if (character.utility && character.utility instanceof SelfFlagellation) {
                        character.utility.lesson = true
                    }
                },
                cost: 1,
                ascend: 12,
                desc: 'Increases move speed for short period after use',
            },
            {
                name: 'leaded by shost',
                type: 'ghost form',
                canUse: (character: Character) => {
                    return character.utility instanceof GhostForm && !character.utility.lead
                },
                teach: (character: Character) => {
                    if (character.utility && character.utility instanceof GhostForm) {
                        character.utility.lead = true
                    }
                },
                cost: 2,
                ascend: 25,
                desc: 'Your teammates also get buff',
            },
            {
                name: 'afterlife cold',
                type: 'ghost form',
                canUse: (character: Character) => {
                    return (
                        character.utility instanceof GhostForm && !character.utility.afterlife_cold
                    )
                },
                teach: (character: Character) => {
                    if (character.utility && character.utility instanceof GhostForm) {
                        character.utility.afterlife_cold = true
                    }
                },
                cost: 1,
                ascend: 12,
                desc: 'Freeze enemies',
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
                desc: 'You have a chance to get energy when you get life',
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
                desc: 'You have a chance to get energy when you block hit',
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
                desc: 'You have a chance to get resourse when you kill enemy',
            },
            {
                name: 'burning circle',
                type: 'new ability',
                canUse: (character: Character) => {
                    return (
                        character instanceof Cultist &&
                        !(character.second_ability instanceof BurningCircle)
                    )
                },
                teach: (character: Character) => {
                    if (character instanceof Cultist) {
                        character.second_ability = new BurningCircle(character)
                        character.updateClientSkill()
                    }
                },
                cost: 3,
                ascend: 15,
                desc: 'Creates a circle of fire in which enemies take damage, the frequency of receiving damage depends on courage',
            },
            {
                name: 'all-consuming flame',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return (
                        character instanceof Cultist &&
                        character.second_ability instanceof BurningCircle &&
                        !character.second_ability.consuming
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Cultist &&
                        character.second_ability instanceof BurningCircle
                    ) {
                        character.second_ability.consuming = true
                    }
                },
                cost: 2,
                ascend: 20,
                desc: 'Increases radius',
            },
            {
                name: 'fire hatred',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return (
                        character instanceof Cultist &&
                        character.second_ability instanceof BurningCircle &&
                        !character.second_ability.hatred
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Cultist &&
                        character.second_ability instanceof BurningCircle
                    ) {
                        character.second_ability.hatred = true
                    }
                },
                cost: 1,
                ascend: 15,
                desc: 'Gives a chance to create explode when your kill enemy',
            },
            {
                name: 'devouring flame',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return (
                        character instanceof Cultist &&
                        character.second_ability instanceof BurningCircle &&
                        !character.second_ability.devouring
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Cultist &&
                        character.second_ability instanceof BurningCircle
                    ) {
                        character.second_ability.devouring = true
                    }
                },
                cost: 1,
                ascend: 15,
                desc: 'Gives a chance to increase duration when you kill enemy',
            },
            {
                name: 'spiritual call',
                canUse: (character: Character) => {
                    return !character.triggers_on_block.some(
                        elem => elem instanceof CallWarriorWhenBlock
                    )
                },
                teach: (character: Character) => {
                    if (character instanceof Cultist) {
                        character.triggers_on_block.push(new CallWarriorWhenBlock())
                    }
                },
                cost: 1,
                ascend: 12,
                desc: 'When you block there is a chance to summon spirit warrior',
            },
            {
                name: 'soul fragments',
                type: 'soulrender',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Soulrender &&
                        !character.first_ability.soul_fragments
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability instanceof Soulrender) {
                        character.first_ability.soul_fragments = true
                    }
                },
                cost: 1,
                ascend: 10,
                desc: 'Increases the count of shards after tear enemy',
            },
            {
                name: 'dark prolifiration',
                type: 'soulrender',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Soulrender &&
                        character.first_ability.prolifiration < 75
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability instanceof Soulrender) {
                        character.first_ability.prolifiration += 25
                    }
                },
                cost: 2,
                ascend: 20,
                desc: 'Gives a chance to your soulrender ability to tear additional nearby target',
            },
        ]
    }
    static getFlyerUpgrades() {
        return [
            {
                name: 'fire spliting',
                type: 'fireball',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Fireball &&
                        !character.first_ability.fire_splitting
                    )
                },
                teach: (character: Character) => {
                    if (character && character.first_ability instanceof Fireball) {
                        character.first_ability.fire_splitting = true
                    }
                },
                cost: 3,
                ascend: 20,
                desc: 'Your fireball has a chance to create additional projectiles based on your courage',
            },
            {
                name: 'icicles',
                type: 'frost sphere',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof FrostSphere &&
                        !character.first_ability.icicles
                    )
                },
                teach: (character: Character) => {
                    if (character && character.first_ability instanceof FrostSphere) {
                        character.first_ability.icicles = true
                    }
                },
                cost: 4,
                ascend: 16,
                desc: 'Your frost sphere releases icicles while moving, count depends on you courage',
            },
            {
                name: 'magic flow',
                canUse: (character: Character) => {
                    return !character.triggers_on_say.some(elem => elem instanceof MagicFlowTrigger)
                },
                teach: (character: Character) => {
                    character.triggers_on_say.push(new MagicFlowTrigger())
                },
                cost: 2,
                ascend: 10,
                desc: 'When you speak there is a chance to get energy to you and allies',
            },
            {
                name: 'scorching',
                type: 'flame wall',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof FlameWall &&
                        !character.second_ability.scorching
                    )
                },
                teach: (character: Character) => {
                    if (character && character.second_ability instanceof FlameWall) {
                        character.second_ability.scorching = true
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'Fire wall deals damage more often',
            },
            {
                name: 'frendly flame',
                type: 'flame wall',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof FlameWall &&
                        !character.second_ability.frendly_flame
                    )
                },
                teach: (character: Character) => {
                    if (character && character.second_ability instanceof FlameWall) {
                        character.second_ability.frendly_flame = true
                    }
                },
                cost: 3,
                ascend: 20,
                desc: 'Your flame wall does not damage to players',
            },
            {
                name: 'takeoff',
                canUse: (character: Character) => {
                    return character instanceof Flyer && !character.takeoff
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer) {
                        character.takeoff = true
                    }
                },
                cost: 2,
                ascend: 20,
                desc: 'You are phased while defended',
            },
            {
                name: 'teeth',
                type: 'new ability',
                canUse: (character: Character) => {
                    return character instanceof Flyer && !(character.first_ability instanceof Teeth)
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer) {
                        character.first_ability = new Teeth(character)
                        character.updateClientSkill()
                    }
                },
                cost: 2,
                ascend: 10,
                desc: 'Fires a sereral of bone teeth',
            },
            {
                name: 'pulling out teeth',
                type: 'teeth',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Teeth && !character.first_ability.pulling
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability instanceof Teeth) {
                        character.first_ability.pulling = true
                    }
                },
                cost: 2,
                ascend: 20,
                desc: 'The number grows due to the corpses nearby',
            },
            {
                name: 'sharp teeth',
                type: 'teeth',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Teeth && !character.first_ability.sharp
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability instanceof Teeth) {
                        character.first_ability.sharp = true
                    }
                },
                cost: 3,
                ascend: 30,
                desc: 'Teeth pierce once',
            },
            {
                name: 'body melting',
                type: 'fireball',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.first_ability instanceof Fireball &&
                        !character.first_ability.body_melting
                    )
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer && character.first_ability instanceof Fireball) {
                        character.first_ability.body_melting = true
                    }
                },
                cost: 2,
                ascend: 20,
                desc: 'Gives your fireball a chance to pass through an enemy without exploding',
            },
            {
                name: 'ignite',
                type: 'fireball',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.first_ability instanceof Fireball &&
                        !character.first_ability.ignite
                    )
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer && character.first_ability instanceof Fireball) {
                        character.first_ability.ignite = true
                    }
                },
                cost: 2,
                ascend: 10,
                desc: 'Your fireball create flame after explosion',
            },
            {
                name: 'hand of frost',
                type: 'frost sphere',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.first_ability instanceof FrostSphere &&
                        !character.first_ability.frost_rich
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.first_ability instanceof FrostSphere
                    ) {
                        character.first_ability.frost_rich = true
                    }
                },
                cost: 1,
                ascend: 10,
                desc: 'Increases radius',
            },
            {
                name: 'ice',
                type: 'frost sphere',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.first_ability instanceof FrostSphere &&
                        !character.first_ability.ice
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.first_ability instanceof FrostSphere
                    ) {
                        character.first_ability.ice = true
                    }
                },
                cost: 2,
                ascend: 15,
                desc: 'Deals damage not only to frozen enemies',
            },
            {
                name: 'shattering ice',
                type: 'frost sphere',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.first_ability instanceof FrostSphere &&
                        !character.first_ability.shattering
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.first_ability instanceof FrostSphere
                    ) {
                        character.first_ability.shattering = true
                    }
                },
                cost: 2,
                ascend: 26,
                desc: 'Deals doubled damage to frozen enemies',
            },
            {
                name: 'reign of frost',
                type: 'frost sphere',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.first_ability instanceof FrostSphere &&
                        !character.first_ability.reign_of_frost
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.first_ability instanceof FrostSphere
                    ) {
                        character.first_ability.reign_of_frost = true
                    }
                },
                cost: 1,
                ascend: 10,
                desc: 'Increases freeze duration',
            },
            {
                name: 'high voltage',
                type: 'lightning bolt',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.first_ability instanceof LightningBolt &&
                        !character.first_ability.high_voltage
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.first_ability instanceof LightningBolt
                    ) {
                        character.first_ability.high_voltage = true
                    }
                },
                cost: 1,
                ascend: 8,
                desc: 'Lightning bolt does not apply shock and hit up to 3 targets',
            },
            {
                name: 'storm',
                type: 'lightning bolt',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.first_ability instanceof LightningBolt &&
                        !character.first_ability.storm
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.first_ability instanceof LightningBolt
                    ) {
                        character.first_ability.storm = true
                        character.first_ability.cost += 1
                    }
                },
                cost: 2,
                ascend: 20,
                desc: 'Grants a chance to create additional bolts based on your courage, but the mana cost increases',
            },
            {
                name: 'conductivity',
                type: 'lightning bolt',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.first_ability instanceof LightningBolt &&
                        !character.first_ability.conductivity
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.first_ability instanceof LightningBolt
                    ) {
                        character.first_ability.conductivity = true
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'Increases radius',
            },
            {
                name: 'improved chain reaction',
                type: 'forking lightning',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.second_ability instanceof ForkedLightning &&
                        !character.second_ability.improved_chain_reaction
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.second_ability instanceof ForkedLightning
                    ) {
                        character.second_ability.improved_chain_reaction = true
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'Increases chain chance',
            },
            {
                name: 'fork',
                type: 'forking lightning',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.second_ability instanceof ForkedLightning &&
                        !character.second_ability.fork
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.second_ability instanceof ForkedLightning
                    ) {
                        character.second_ability.fork = true
                    }
                },
                cost: 3,
                ascend: 26,
                desc: 'Increases the amount of creating lightnings when chain',
            },
            {
                name: 'lightning eye',
                type: 'forking lightning',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.second_ability instanceof ForkedLightning &&
                        !character.second_ability.lightning_eye
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.second_ability instanceof ForkedLightning
                    ) {
                        character.second_ability.lightning_eye = true
                    }
                },
                cost: 2,
                ascend: 8,
                desc: 'Increases the target check radius for a new one',
            },
            {
                name: 'lightning waves',
                type: 'light beacon',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.third_ability instanceof LightBeacon &&
                        !character.third_ability.lightning_waves
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.third_ability instanceof LightBeacon
                    ) {
                        character.third_ability.lightning_waves = true
                    }
                },
                cost: 3,
                ascend: 12,
                desc: 'Creates waves of electricity instead lightnings',
            },
            {
                name: 'air form',
                type: 'light beacon',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.third_ability instanceof LightBeacon &&
                        !character.third_ability.air_form
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.third_ability instanceof LightBeacon
                    ) {
                        character.third_ability.air_form = true
                    }
                },
                cost: 2,
                ascend: 28,
                desc: 'After cast, you cannot take damage for 3 seconds',
            },
            {
                name: 'ice genesis',
                type: 'frostnova',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof Frostnova &&
                        !character.third_ability.ice_genesis
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.third_ability instanceof Frostnova
                    ) {
                        character.third_ability.ice_genesis = true
                    }
                },
                cost: 3,
                ascend: 20,
                desc: 'If you kill the enemy there is a chance to create frost sphere',
            },
            {
                name: 'cold spires',
                type: 'frostnova',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.third_ability instanceof Frostnova &&
                        !character.third_ability.cold_spires
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Flyer &&
                        character.third_ability instanceof Frostnova
                    ) {
                        character.third_ability.cold_spires = true
                    }
                },
                cost: 4,
                ascend: 30,
                desc: 'Upon cast, you create icy spires that freeze enemies and explode',
            },
            {
                name: 'hand cuffing',
                type: 'static field',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.utility instanceof StaticField &&
                        !character.utility.hand_cuffing
                    )
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer && character.utility instanceof StaticField) {
                        character.utility.hand_cuffing = true
                    }
                },
                cost: 1,
                ascend: 10,
                desc: 'Targets in static field cannot attack',
            },
            {
                name: 'collapse',
                type: 'static field',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.utility instanceof StaticField &&
                        !character.utility.collapse
                    )
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer && character.utility instanceof StaticField) {
                        character.utility.collapse = true
                    }
                },
                cost: 2,
                ascend: 15,
                desc: 'Targets in static field will take damage after duration',
            },
            {
                name: 'protected teleportation',
                type: 'teleportation',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.utility instanceof Teleportation &&
                        !character.utility.protected
                    )
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer && character.utility instanceof Teleportation) {
                        character.utility.protected = true
                    }
                },
                cost: 2,
                ascend: 16,
                desc: 'You cannot take damage after you start teleporting',
            },
            {
                name: 'increased gate',
                type: 'teleportation',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        character.utility instanceof Teleportation &&
                        !character.utility.increased_gate
                    )
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer && character.utility instanceof Teleportation) {
                        character.utility.increased_gate = true
                    }
                },
                cost: 1,
                ascend: 10,
                desc: 'Increases radius of end point',
            },
            {
                name: 'mana regen while defend',
                canUse: (character: Character) => {
                    return character instanceof Flyer && !character.allow_mana_regen_while_def
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer && !character.allow_mana_regen_while_def) {
                        character.allow_mana_regen_while_def = true
                    }
                },
                cost: 4,
                ascend: 22,
                desc: 'Allows you to restore mana while you are in defend state',
            },
            {
                name: 'charged shield',
                canUse: (character: Character) => {
                    return character instanceof Flyer && !character.charged_shield
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer && !character.charged_shield) {
                        character.charged_shield = true
                    }
                },
                cost: 1,
                ascend: 12,
                desc: 'There is a chance to create lightning when you block',
            },
            {
                name: 'annihilator beam',
                type: 'new ability',
                canUse: (character: Character) => {
                    return (
                        character instanceof Flyer &&
                        !(character.second_ability instanceof AnnihilatorBeam)
                    )
                },
                teach: (character: Character) => {
                    if (character instanceof Flyer) {
                        character.second_ability = new AnnihilatorBeam(character)
                        character.updateClientSkill()
                    }
                },
                cost: 2,
                ascend: 6,
                desc: 'Creates a beam of energy that burns enemies',
            },
            {
                name: 'light stream',
                type: 'annihilator beam',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof AnnihilatorBeam &&
                        character.second_ability.cost >= 3
                    )
                },
                teach: (character: Character) => {
                    if (character.second_ability instanceof AnnihilatorBeam) {
                        character.second_ability.cost -= 1
                    }
                },
                cost: 2,
                ascend: 16,
                desc: 'Reduses mana cost',
            },
            {
                name: 'concentrating energy',
                type: 'annihilator beam',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof AnnihilatorBeam &&
                        !character.second_ability.concentrating_energy
                    )
                },
                teach: (character: Character) => {
                    if (character.second_ability instanceof AnnihilatorBeam) {
                        character.second_ability.concentrating_energy = true
                    }
                },
                cost: 1,
                ascend: 20,
                desc: 'Ignores armour',
            },
            {
                name: 'penetrating lightning',
                type: 'sparks',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof Sparks &&
                        character.third_ability.pierce < 3
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability instanceof Sparks) {
                        character.third_ability.pierce++
                    }
                },
                cost: 3,
                ascend: 18,
                desc: 'Increases the number of enemies your sparks can pass through',
            },
            {
                name: 'shocking sparks',
                type: 'sparks',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof Sparks && !character.third_ability.shock
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability instanceof Sparks) {
                        character.third_ability.shock = true
                    }
                },
                cost: 2,
                ascend: 25,
                desc: 'Your sparks shocks enemies',
            },
            {
                name: 'strong sparks',
                type: 'sparks',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof Sparks &&
                        character.third_ability.ttl < 10000
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability instanceof Sparks) {
                        character.third_ability.ttl += 2000
                    }
                },
                cost: 1,
                ascend: 10,
                desc: 'Increases duration',
            },
        ]
    }
    static getSwordmanUpgrades() {
        return [
            {
                name: 'crushing swings',
                type: 'weapon swing',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof WeaponSwing &&
                        !character.first_ability.crushing
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof WeaponSwing) {
                        character.first_ability.crushing = true
                    }
                },
                cost: 4,
                ascend: 20,
                desc: 'Increase attack range and slash angle',
            },
            {
                name: 'spirit weapon',
                canUse: (character: Character) => {
                    return character.attack_radius <= 16 && character.perception >= 8
                },
                teach: (character: Character): void => {
                    character.attack_radius += 1.5
                },
                cost: 3,
                ascend: 16,
                desc: 'Increases your attack range',
            },
            {
                name: 'echo swing',
                type: 'weapon swing',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof WeaponSwing &&
                        !character.first_ability.echo_swing
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof WeaponSwing) {
                        character.first_ability.echo_swing = true
                    }
                },
                cost: 2,
                ascend: 10,
                desc: 'Gives your weapon swing chance to land an additional swing after a short time',
            },
            {
                name: 'improved swing technology',
                type: 'weapon swing',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof WeaponSwing &&
                        !character.first_ability.improved_swing_technology
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof WeaponSwing) {
                        character.first_ability.improved_swing_technology = true
                    }
                },
                cost: 1,
                ascend: 18,
                desc: 'Gives your weapon swing chance to increase move and attack speed for a short period',
            },
            {
                name: 'light grip',
                type: 'weapon throw',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof WeaponThrow &&
                        !character.first_ability.light_grip
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof WeaponThrow) {
                        character.first_ability.light_grip = true
                    }
                },
                cost: 2,
                ascend: 16,
                desc: 'Gives your weapon throw ability a chance to reduce cd time between uses by 50%',
            },
            {
                name: 'multiple blades',
                type: 'weapon throw',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof WeaponThrow &&
                        !character.first_ability.multiple
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof WeaponThrow) {
                        character.first_ability.multiple = true
                    }
                },
                cost: 4,
                ascend: 20,
                desc: 'Provide you a chance to create additional copies of your throwed weapon',
            },
            {
                name: 'returning',
                type: 'weapon throw',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof WeaponThrow &&
                        !character.first_ability.returning &&
                        !character.first_ability.shattering
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof WeaponThrow) {
                        character.first_ability.returning = true
                    }
                },
                cost: 3,
                ascend: 26,
                desc: 'Thrown weapons have a chance to return',
            },
            {
                name: 'while we alive',
                type: 'inner power',
                canUse: (character: Character) => {
                    let status = character.level.status_pull.find(
                        elem => elem.unit === character && elem instanceof InnerPowerTrigger
                    )
                    if (!status || !(status instanceof InnerPowerTrigger)) return

                    return !status.while_alive
                },
                teach: (character: Character) => {
                    let status = character.level.status_pull.find(
                        elem => elem.unit === character && elem instanceof InnerPowerTrigger
                    )
                    if (!status || !(status instanceof InnerPowerTrigger)) return

                    status.while_alive = true
                },
                cost: 3,
                ascend: 30,
                desc: 'Your inner power passive also gives fortify(40%)',
            },
            {
                name: 'shattering',
                type: 'weapon throw',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof WeaponThrow &&
                        !character.first_ability.returning &&
                        !character.first_ability.shattering
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability && character.first_ability instanceof WeaponThrow) {
                        character.first_ability.shattering = true
                    }
                },
                cost: 3,
                ascend: 30,
                desc: 'Thrown weapons have a chance to shatter and realise metal parts that hit enemies',
            },
            {
                name: 'heavy landing',
                type: 'jump',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof Jump &&
                        !character.second_ability.heavy_landing
                    )
                },
                teach: (character: Character) => {
                    if (character.second_ability && character.second_ability instanceof Jump) {
                        character.second_ability.heavy_landing = true
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'After landing by jump ability your will get armour by each hited enemy',
            },
            {
                name: 'stomp',
                type: 'jump',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof Jump && !character.second_ability.stomp
                    )
                },
                teach: (character: Character) => {
                    if (character.second_ability && character.second_ability instanceof Jump) {
                        character.second_ability.stomp = true
                    }
                },
                cost: 3,
                ascend: 26,
                desc: 'Increases radius',
            },
            {
                name: 'destroyer',
                type: 'charge',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof Charge &&
                        !character.second_ability.destroyer
                    )
                },
                teach: (character: Character) => {
                    if (character.second_ability && character.second_ability instanceof Charge) {
                        character.second_ability.destroyer = true
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'Gives a chance to deal damage by charge ability',
            },
            {
                name: 'vision of possibilities',
                type: 'charge',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof Charge &&
                        !character.second_ability.possibilities
                    )
                },
                teach: (character: Character) => {
                    if (character.second_ability && character.second_ability instanceof Charge) {
                        character.second_ability.possibilities = true
                    }
                },
                cost: 2,
                ascend: 16,
                desc: 'If you hit 3 or more enemies with the charge ability, you have a chance to gain Energy',
            },
            {
                name: 'blood harvest',
                type: 'whirlwind',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof Whirlwind &&
                        !character.third_ability.blood_harvest
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability && character.third_ability instanceof Whirlwind) {
                        character.third_ability.blood_harvest = true
                    }
                },
                cost: 5,
                ascend: 35,
                desc: 'After using the whirlwind, you have a chance to create a blood sphere',
            },
            {
                name: 'fan of swords',
                type: 'whirlwind',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof Whirlwind &&
                        !character.third_ability.fan_of_swords
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability && character.third_ability instanceof Whirlwind) {
                        character.third_ability.fan_of_swords = true
                    }
                },
                cost: 6,
                ascend: 40,
                desc: 'Your whirlwind now shoots a fan of swords, and the weapon throwing ability upgrade also works',
            },
            {
                name: 'consequences',
                type: 'quake',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof Quake &&
                        !character.third_ability.consequences
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability && character.third_ability instanceof Quake) {
                        character.third_ability.consequences = true
                    }
                },
                cost: 3,
                ascend: 26,
                desc: 'Quake has a larger radius but an increased weakness duration',
            },
            {
                name: 'blast',
                type: 'quake',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof Quake && !character.third_ability.blasted
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability && character.third_ability instanceof Quake) {
                        character.third_ability.blasted = true
                    }
                },
                cost: 3,
                ascend: 35,
                desc: 'Provide a chance to instant kill',
            },
            {
                name: 'selfcare',
                type: 'quake',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof Quake &&
                        !character.third_ability.selfcare
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability && character.third_ability instanceof Quake) {
                        character.third_ability.selfcare = true
                    }
                },
                cost: 2,
                ascend: 10,
                desc: 'Your quake ability does not deal damage to you',
            },
            {
                name: 'drinker',
                type: 'cursed weapon',
                canUse: (character: Character) => {
                    return character.utility instanceof CursedWeapon && !character.utility.drinker
                },
                teach: (character: Character) => {
                    if (character.utility && character.utility instanceof CursedWeapon) {
                        character.utility.drinker = true
                    }
                },
                cost: 2,
                ascend: 16,
                desc: 'While you are affected by cursed weapon you have increased vampiric rate',
            },
            {
                name: 'fast commands',
                type: 'commands',
                canUse: (character: Character) => {
                    return character.utility instanceof Commands && !character.utility.fast_commands
                },
                teach: (character: Character) => {
                    if (character.utility && character.utility instanceof Commands) {
                        character.utility.fast_commands = true
                    }
                },
                cost: 1,
                ascend: 16,
                desc: 'Buff becomes shorter but stronger',
            },
            {
                name: 'shattered weapon',
                type: 'new ability',
                canUse: (character: Character) => {
                    return !(character.second_ability instanceof ShatteredWeapon)
                },
                teach: (character: Character) => {
                    if (character instanceof Swordman) {
                        character.second_ability = new ShatteredWeapon(character)
                        character.updateClientSkill()
                    }
                },
                cost: 2,
                ascend: 12,
                desc: 'Fires fragments of your weapon that return to you when they hit walls or enemies, increasing your armor',
            },
            {
                name: 'searching weapon',
                canUse: (character: Character) => {
                    return character.attack_radius < 10
                },
                teach: (character: Character) => {
                    if (character instanceof Swordman) {
                        character.attack_radius++
                    }
                },
                cost: 2,
                ascend: 8,
                desc: 'Increases attack range',
            },
            {
                name: 'attack speed',
                canUse: (character: Character) => {
                    return character.attack_speed > 600
                },
                teach: (character: Character) => {
                    if (character instanceof Swordman) {
                        character.attack_speed -= 40
                    }
                },
                cost: 2,
                desc: 'Increases attack speed',
            },
            {
                name: 'heaven vengeance',
                type: 'new ability',
                canUse: (character: Character) => {
                    return !(character.first_ability instanceof HeavenVengeance)
                },
                teach: (character: Character) => {
                    if (character instanceof Swordman) {
                        character.first_ability = new HeavenVengeance(character)
                        character.updateClientSkill()
                    }
                },
                cost: 2,
                ascend: 10,
                desc: 'Hits one enemy and strikes nearby enemies with lightning',
            },
            {
                name: 'eye for eye',
                type: 'heaven vengeance',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof HeavenVengeance &&
                        !character.first_ability.eye
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Swordman &&
                        character.first_ability instanceof HeavenVengeance
                    ) {
                        character.first_ability.eye = true
                    }
                },
                cost: 1,
                ascend: 12,
                desc: 'Increases radius of serching targets by your courage',
            },
            {
                name: 'heaven grace',
                type: 'heaven vengeance',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof HeavenVengeance &&
                        !character.first_ability.grace
                    )
                },
                teach: (character: Character) => {
                    if (
                        character instanceof Swordman &&
                        character.first_ability instanceof HeavenVengeance
                    ) {
                        character.first_ability.grace = true
                        character.triggers_on_get_hit.push(character.first_ability)
                    }
                },
                cost: 1,
                ascend: 8,
                desc: 'Gives a chance to reset cooldown when taking damage',
            },
            {
                name: 'emergency orders',
                canUse: (character: Character) => {
                    return !character.triggers_on_say.some(
                        elem => elem instanceof EmergencyOrdersTrigger
                    )
                },
                teach: (character: Character) => {
                    character.triggers_on_say.push(new EmergencyOrdersTrigger())
                },
                cost: 3,
                ascend: 16,
                desc: 'When speak, you a chance to grant you and your allies gain Command ability buff',
            },
            {
                name: 'blocking technique',
                canUse: (character: Character) => {
                    return !character.triggers_on_block.some(
                        elem => elem instanceof BlockingTechnique
                    )
                },
                teach: (character: Character) => {
                    character.triggers_on_block.push(new BlockingTechnique())
                },
                cost: 3,
                ascend: 20,
                desc: 'When you block 5 hits the next three will be successfully blocked',
            },
            {
                name: 'electrified dash',
                type: 'dash',
                canUse: (character: Character) => {
                    return (
                        character.first_ability instanceof Dash &&
                        !character.first_ability.electrified
                    )
                },
                teach: (character: Character) => {
                    if (character.first_ability instanceof Dash) {
                        character.first_ability.electrified = true
                    }
                },
                cost: 4,
                ascend: 25,
                desc: 'Dash now spawns sparks upon completion of the move, the number of which depends on the targets hit',
            },
            {
                name: 'pointed spines',
                type: 'metal thorns',
                canUse: (character: Character) => {
                    return (
                        character.second_ability instanceof MetalThorns &&
                        !character.second_ability.pointed
                    )
                },
                teach: (character: Character) => {
                    if (character.second_ability instanceof MetalThorns) {
                        character.second_ability.pointed = true
                    }
                },
                cost: 2,
                ascend: 15,
                desc: 'Metal thorns crush enemies when hit',
            },
            {
                name: 'call of arms',
                type: 'spectral swords',
                canUse: (character: Character) => {
                    return (
                        character.third_ability instanceof SpectralSwords &&
                        !character.third_ability.call
                    )
                },
                teach: (character: Character) => {
                    if (character.third_ability instanceof SpectralSwords) {
                        character.third_ability.call = true
                    }
                },
                cost: 4,
                ascend: 30,
                desc: 'Increases number of swords and their speed',
            },
        ]
    }
}
