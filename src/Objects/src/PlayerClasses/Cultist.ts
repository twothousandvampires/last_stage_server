import GhostForm from '../../../Abilities/Cultist/GhostForm'
import GrimPile from '../../../Abilities/Cultist/GrimPile'
import PileOfThornCast from '../../../Abilities/Cultist/PileOfThornCast'
import Rune from '../../../Abilities/Cultist/Rune'
import SelfFlagellation from '../../../Abilities/Cultist/SelfFlagellation'
import ShieldBash from '../../../Abilities/Cultist/ShieldBash'
import Slam from '../../../Abilities/Cultist/Slam'
import Soulrender from '../../../Abilities/Cultist/Soulrender'
import UnleashPain from '../../../Abilities/Cultist/UnleashPain'
import WanderingEvil from '../../../Abilities/Cultist/WanderingEvil'
import Upgrades from '../../../Classes/Upgrades'
import Func from '../../../Func'
import Level from '../../../Level'
import PlayerDyingState from '../../../State/PlayerDyingState'
import Immortality from '../../../Status/Immortality'
import Armour from '../../Effects/Armour'
import Blood from '../../Effects/Blood'
import ToothExplode from '../../Effects/ToothExplode'
import Character from '../Character'
import Unit from '../Unit'

export default class Cultist extends Character {
    static MIN_ATTACK_SPEED = 200
    static MIN_CAST_SPEED = 150
    static MAX_ARMOUR = 95

    resource: number
    maximum_resources: number
    next_life_regen_time: any
    attack_point_radius: number
    hit_x: number | undefined
    hit_y: number | undefined
    weapon_angle: number
    recent_hits: any
    check_recent_hits_timer: any
    service: boolean
    conduct_of_pain: boolean
    pain_extract: boolean

    constructor(level: Level) {
        super(level)

        this.weapon_angle = 1.6
        this.attack_point_radius = 4.3
        this.attack_radius = 7
        this.attack_speed = 1550
        this.cast_speed = 1600
        this.name = 'cultist'
        this.move_speed = 0.43
        this.chance_to_avoid_damage_state = 15
        this.armour_rate = 25
        this.resource = 0
        this.maximum_resources = 7
        this.hit_x = undefined
        this.hit_y = undefined
        this.enlightenment_threshold = 7

        this.base_regeneration_time = 8500
        this.service = false
        this.conduct_of_pain = false
        this.pain_extract = false

        this.recent_hits = []
        this.chance_to_block = 65
    }

    getSkipDamageStateChance() {
        return this.chance_to_avoid_damage_state + this.perception * 3
    }

    getCdRedaction() {
        return this.cooldown_redaction + this.perception
    }

    getMoveSpeed(): number {
        let total_inc = this.move_speed_penalty + this.agility

        if (total_inc === 0) return this.move_speed

        if (total_inc > 200) total_inc = 200
        if (total_inc < -95) total_inc = -95

        return this.move_speed * (1 + total_inc / 100)
    }

    createAbilities(abilities: any) {
        let main_name = abilities.find(elem => elem.type === 1 && elem.selected).name

        if (main_name === 'slam') {
            this.first_ability = new Slam(this)
        } else if (main_name === 'rune') {
            this.first_ability = new Rune(this)
        } else if (main_name === 'soulrender') {
            this.first_ability = new Soulrender(this)
        }

        let secondary_name = abilities.find(elem => elem.type === 2 && elem.selected).name

        if (secondary_name === 'shield bash') {
            this.second_ability = new ShieldBash(this)
        } else if (secondary_name === 'grim pile') {
            this.second_ability = new GrimPile(this)
        }

        let finisher_name = abilities.find(elem => elem.type === 3 && elem.selected).name

        if (finisher_name === 'unleashing pain') {
            this.third_ability = new UnleashPain(this)
        } else if (finisher_name === 'pile of thorns') {
            this.third_ability = new PileOfThornCast(this)
        } else if (finisher_name === 'wandering evil') {
            this.third_ability = new WanderingEvil(this)
        }

        let utility_name = abilities.find(elem => elem.type === 4 && elem.selected).name

        if (utility_name === 'self flagellation') {
            this.utility = new SelfFlagellation(this)
        } else if (utility_name === 'ghost form') {
            this.utility = new GhostForm(this)
        }
    }

    addCourage(count = 1) {
        if (!this.can_get_courage) return

        for (let i = 0; i < count; i++) {
            this.recent_hits.push(this.level.time)
        }

        if (this.can_be_enlighten && this.recent_hits.length >= this.enlightenment_threshold) {
            this.can_be_enlighten = false

            this.enlight()

            setTimeout(() => {
                this.can_be_enlighten = true
            }, this.getEnlightenTimer())
        }
    }

    addResourse(count: number = 1, ignore_limit = false) {
        if (!this.can_regen_resource) return

        this.playerGetResourse()

        if (this.resource < this.maximum_resources || ignore_limit) {
            this.resource += count
        }

        if (Func.chance(this.durability * 3, this.is_lucky)) {
            if (this.resource < this.maximum_resources) {
                this.resource++
            }
        }
    }

    enlight() {
        let count = 10

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones

            let angle = min_a
            let proj = new ToothExplode(this.level)
            proj.setPoint(this.x + 7 * Math.sin(angle), this.y + 7 * Math.cos(angle))

            this.level.effects.push(proj)
        }

        this.can_be_damaged = false
        this.armour_rate += 1

        let s = new Immortality(this.level.time)
        s.setDuration(3000)

        this.playerWasEnlighted()
        this.level.setStatus(this, s)

        this.level.addSound('enlight', this.x, this.y)
    }

    getTotalArmour() {
        return this.armour_rate + this.might
    }

    getPenaltyByLifeStatus(): number {
        if (this.life_status === 2) {
            return 5
        } else if (this.life_status === 1) {
            return 10
        } else {
            return 0
        }
    }

    isBlock(): boolean {
        let b_chance = this.chance_to_block + this.agility

        if (b_chance > 90) {
            b_chance = 90
        }

        return this.state === 'defend' && Func.chance(b_chance, this.is_lucky)
    }

    isArmourHit(unit: Unit): boolean {
        let p = 0

        if (unit) {
            p = unit.pierce
        }

        let total = this.getTotalArmour()

        if (p >= total) return false

        let arm = total - p

        if (arm > Cultist.MAX_ARMOUR) {
            arm = Cultist.MAX_ARMOUR
        }

        return Func.chance(arm, this.is_lucky)
    }

    isSpiritBlock() {
        if (this.resource <= 0) return false

        return Func.chance(this.spirit + this.durability, this.is_lucky)
    }

    getPower(): number {
        return this.power + this.will
    }

    takeDamage(unit: any = undefined, options: any = {}) {
        if (!this.can_be_damaged) return

        if (this.damaged || this.is_dead) return

        if (options?.instant_death) {
            unit?.succesefulKill()
            this.is_dead = true
            this.life_status = 0
            this.setState(new PlayerDyingState())
            return
        }

        if (this.ward) {
            let count = 1
            if (unit && Func.chance(unit.critical)) {
                count++
            }
            this.loseWard(count)
            let e = new ToothExplode(this.level)
            e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
            e.z = Func.random(2, 8)
            this.level.effects.push(e)

            this.level.addSound({
                name: 'ward hit',
                x: this.x,
                y: this.y,
            })
        }

        this.playerWasHited(unit)

        if (this.isSpiritBlock()) {
            this.resource--
            return
        }

        let is_armour_hit = this.isArmourHit(unit)

        if (this.isBlock()) {
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y,
            })

            if (this.conduct_of_pain && Func.chance(50, this.is_lucky)) {
                this.addResourse()
            }

            this.succesefulBlock(unit)

            if (is_armour_hit) {
                this.succesefulArmourBlock(unit)
            }

            return
        }

        this.addResourse()
        this.addCourage()

        if (is_armour_hit) {
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y,
            })
            let e = new Armour(this.level)
            e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
            e.z = Func.random(2, 8)
            this.level.effects.push(e)
            this.succesefulArmourBlock(unit)
            return
        }

        if (Func.chance(30)) {
            this.level.addSound('get hit', this.x, this.y)
        }

        let e = new Blood(this.level)
        e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
        e.z = Func.random(2, 8)
        this.level.effects.push(e)

        let will_avoid = this.will * 2

        if (will_avoid > 50) {
            will_avoid = 50
        }

        if (Func.chance(will_avoid, this.is_lucky)) {
            return
        }

        this.subLife(unit, options)
    }

    getSecondResource() {
        return this.recent_hits.length
    }

    getRegenTimer() {
        return this.base_regeneration_time
    }

    generateUpgrades() {
        if (!this.can_generate_upgrades) return
        if (this.upgrades.length) return

        //get all upgrades for this class
        let p = Upgrades.getAllUpgrades()
        let all = Upgrades.getCultistUpgrades().concat(p)

        //filter by usability
        let filtered = all.filter(elem => {
            return (
                (!elem.ascend || this.ascend_level >= elem.ascend) &&
                elem.cost <= this.grace &&
                elem.canUse(this)
            )
        })
        filtered.forEach(elem => {
            if (elem.ascend === undefined) {
                elem.ascend = 0
            }
        })

        filtered.sort((a, b) => {
            return b.cost + b.ascend - (a.cost + a.ascend)
        })

        let part_size = Math.ceil(filtered.length / 3)

        let part1 = filtered.slice(0, part_size)
        let part2 = filtered.slice(part_size, part_size * 2)
        let part3 = filtered.slice(part_size * 2)

        this.upgrades = this.upgrades.concat(Func.getRandomFromArray(part1))
        this.upgrades = this.upgrades.concat(Func.getRandomFromArray(part2))
        this.upgrades = this.upgrades.concat(Func.getRandomFromArray(part3))

        this.upgrades = this.upgrades.filter(elem => elem)
    }

    startGame() {
        let time = Date.now()
        this.equipItems()
        this.next_life_regen_time = time + this.getRegenTimer()
        this.check_recent_hits_timer = time + 1000
    }

    getSecondResourceTimer() {
        return this.courage_expire_timer + this.knowledge * 300
    }

    regen() {
        let second_resouce_timer = this.getSecondResourceTimer()

        if (this.level.time >= this.check_recent_hits_timer) {
            this.check_recent_hits_timer += 1000

            for (let i = this.recent_hits.length; i >= 0; i--) {
                let hit_time = this.recent_hits[i]

                if (this.level.time - hit_time >= second_resouce_timer) {
                    this.recent_hits.splice(i, 1)
                }
            }

            this.sayPhrase()
        }

        if (this.level.time >= this.next_life_regen_time) {
            this.next_life_regen_time += this.getRegenTimer()

            this.addLife()

            if (this.service) {
                if (Func.chance(this.getSecondResource() * 10, this.is_lucky)) {
                    this.addResourse()
                }
            }
        }
    }

    succesefulKill(enemy: Unit) {
        super.succesefulKill(enemy)

        if (this.pain_extract && Func.chance(5, this.is_lucky)) {
            this.addResourse()
        }
    }

    getStatDescription(stat: string) {
        if (stat === 'might') {
            return `Increases your attack speed.
                        Increases your armour.`
        }
        if (stat === 'will') {
            return `Gives a chance to avoid damage.
                       Increases status resistance.
                       Increases your power`
        }
        if (stat === 'agility') {
            return `Increases your move speed.
                          Increases a block chance.`
        }
        if (stat === 'knowledge') {
            return `Gives a chance not to spend mana when used.
                            Increases your cast speed.`
        }
        if (stat === 'durability') {
            return `Increases spirit.
                             Gives a chance to get additional energy.`
        }
        if (stat === 'perception') {
            return `Increases a chance to avoid damage state.
                             Reduses cooldowns of abilities.`
        }

        return ''
    }

    getAttackSpeed() {
        let value = this.attack_speed - this.might * 15

        if (value < Cultist.MIN_ATTACK_SPEED) {
            value = Cultist.MIN_ATTACK_SPEED
        }

        return value
    }

    getMoveSpeedPenaltyValue() {
        return 70
    }

    getCastSpeed() {
        let value = this.cast_speed - this.knowledge * 50

        if (value < Cultist.MIN_CAST_SPEED) {
            value = Cultist.MIN_CAST_SPEED
        }

        return value
    }

    payCost() {
        if (this.free_cast) {
            this.pay_to_cost = 0
            this.free_cast = false
            return
        }

        if (Func.notChance(this.knowledge, this.is_lucky)) {
            this.resource -= this.pay_to_cost
        }

        this.pay_to_cost = 0
        if (this.resource < 0) {
            this.resource = 0
        }
    }

    getResistValue(): number {
        return this.status_resistance + this.will * 2
    }
}
