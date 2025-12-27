import Func from '../../../Func'
import Level from '../../../Level'
import EnemyDeadState from '../../../State/EnemyDeadState'
import EnemyDyingState from '../../../State/EnemyDyingState'
import EnemyMeleeIdleState from '../../../State/EnemyMeleeIdleState'
import EnemySpawnState from '../../../State/EnemySpawnState'
import Armour from '../../Effects/Armour'
import SmallTextLanguage2 from '../../Effects/SmallTextLanguage2'
import Character from '../Character'
import Unit from '../Unit'

export default abstract class Enemy extends Unit {
    is_spawning: boolean = true
    target: Character | undefined
    check_timer: any
    player_check_radius = 40
    can_check_player: boolean = true
    dying_time: number = 1200
    spawn_time: number = 1200
    dead_type: string | undefined
    cooldown_attack: number = 2000
    retreat_distance: number = 0
    retreat_angle: number | undefined
    ranged: boolean = false
    hit_x: number = 0
    hit_y: number = 0

    create_grace_chance: number = 15
    create_energy_chance: number = 6
    create_entity_chance: number = 6
    create_item_chance: number = 0
    create_sorcerers_skull_chance: number = 0
    create_helm_of_ascendence_chance: number = 1

    create_chance: number = 17
    last_action: number = 0

    count_as_killed: boolean = true
    say_z: number = 12
    gold_revard: number = 1
    can_be_burned: boolean = true
    abilities: any[] = []
    dead_time: number = 5000
    killed_by: Character | undefined

    constructor(level: Level) {
        super(level)
        this.name = 'enemy'
    }

    hitImpact() {}

    whenDead() {}

    getCastStateString() {
        return 'attack'
    }

    isAbilityToUse() {
        if (this.abilities.length === 0) return false

        return this.abilities.some(elem => elem.canUse(this))
    }

    getDeadStateInstance() {
        return new EnemyDeadState()
    }

    checkPlayer() {
        if (this.can_check_player) {
            if (!this.target) {
                this.can_check_player = false

                let p = this.level.players.filter(
                    elem =>
                        Func.distance(this, elem) <= this.player_check_radius &&
                        !elem.is_dead &&
                        elem.z < 5
                )

                p.sort((a, b) => {
                    return Func.distance(a, this) - Func.distance(b, this)
                })

                this.target = p[0]
            } else {
                if (
                    Func.distance(this, this.target) > this.player_check_radius ||
                    this.target.is_dead
                ) {
                    this.target = undefined
                }
            }

            setTimeout(() => {
                this.can_check_player = true
            }, 2000)
        }
    }

    getTotalWeights() {
        return [
            ['grace', this.create_grace_chance],
            ['energy', this.create_energy_chance],
            ['entity', this.create_entity_chance],
            ['item', this.create_item_chance],
            ['skull', this.create_sorcerers_skull_chance],
            ['helm', this.create_helm_of_ascendence_chance],
        ]
    }

    setImpactTime(c: number) {
        if (!this.action_time) return

        c += Func.chance(50) ? 5 : -5
        this.action_impact = this.level.time + this.action_time * (c / 100)
        this.action_end_time = this.level.time + this.action_time
        this.last_action = this.level.time + this.action_time
    }

    enemyCanAtack() {
        return this.level.time - this.last_action >= this.cooldown_attack
    }

    act(time: number) {
        if (!this.current_state) {
            this.getState()
        }

        if (this.current_state) {
            this.current_state.update(this)
        }

        if (this.action_impact && time >= this.action_impact) {
            if (!this.action) {
                this.action = true
            } else {
                this.action = false
                this.action_impact = 0
            }
        }
        if (this.action_end_time && time >= this.action_end_time) {
            if (!this.action_is_end) {
                this.action_is_end = true
            } else {
                this.action_is_end = false
                this.action_end_time = 0
            }
        }
    }

    // todo
    afterDead() {}

    getExplodedSound() {
        return {
            name: 'corpse explode',
            x: this.x,
            y: this.y,
        }
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            state: this.state,
            flipped: this.flipped,
            name: this.name,
            z: this.z,
            action: this.action,
            action_time: this.action_time,
            invisible: this.invisible,
        }
    }

    forceLethalDamage() {
        this.life_status = 0
        this.setState(new EnemyDyingState())
    }

    takePureDamage(unit: any = undefined, options: any = {}) {
        if (this.is_dead) return
        if (!this.can_be_damaged) return

        if (this.checkArmour(unit)) {
            return
        }

        let is_player_deal_hit = unit instanceof Character

        let damage_value = 1

        if (options?.damage_value) {
            damage_value = options.damage_value
        }

        // if (is_player_deal_hit) {
        //     let pierce = unit.getPierce()
        //     let is_pierce = Func.chance(pierce - this.armour_rate)

        //     if (is_pierce) {
        //         damage_value ++
        //     }
        // }

        this.life_status -= damage_value

        if (this.life_status <= 0) {
            this.is_dead = true

            if (options?.explode) {
                this.exploded = true
                this.level.addSound(this.getExplodedSound())
            } else if (options?.burn && this.can_be_burned) {
                this.burned = true
            }

            if (is_player_deal_hit) {
                this.killed_by = unit

                unit.succesefulKill(this)
                unit.addGold(this.gold_revard)
            }

            this.setState(new EnemyDyingState())
        }
    }

    deadSound() {}

    takeDamage(unit: any = undefined, options: any = {}) {
        if (this.is_dead) return
        if (!this.can_be_damaged) return

        let is_player_deal_hit = unit instanceof Character

        let instantly = this.can_be_instant_killed && (options?.instant_death || (is_player_deal_hit && Func.chance(unit.chance_to_instant_kill)))

        if (instantly) {
            this.life_status = 1
            this.armour_rate = 0
        }

        if (this.checkArmour(unit)) {
            this.level.addSound({
                name: 'metal hit',
                x: this.x,
                y: this.y,
            })
            let e = new Armour(this.level)
            e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
            e.z = Func.random(2, 8)
            this.level.effects.push(e)

            return
        }

        let damage_value = 1

        if (options?.damage_value) {
            damage_value = options.damage_value
        }

        if (is_player_deal_hit) {
            let pierce = unit.getPierce()
            let is_pierce = Func.chance(pierce - this.armour_rate)

            if (is_pierce) {
                damage_value ++
                unit.succesefulPierce(this)
            }
        }

        if (this.crushing > 0) {    
            damage_value += this.crushing
        }

        if (is_player_deal_hit && unit.isCrushing()) {    
            this.crushing ++
            unit.playerApplyCrushing(this)
        }

        if (Func.chance(this.fortify)) { 
            damage_value --
        }

        if (is_player_deal_hit && Func.chance(unit.getCritical())) {
            damage_value *= 2       
            unit.succesefulCritical(this)  
        }

        if (this.fragility) {  
            damage_value *= 2
        }

        if (is_player_deal_hit && Func.chance(unit.getPower())) {
            damage_value++
        }

        this.life_status -= damage_value

        if (is_player_deal_hit) {
            unit.succesefulHit(this, damage_value)
        }

        if (this.life_status <= 0) {
            this.is_dead = true

            if (options?.explode) {
                this.exploded = true
                this.level.addSound(this.getExplodedSound())
            } else if (options?.burn && this.can_be_burned) {
                this.burned = true
            }

            if (is_player_deal_hit) {
                this.killed_by = unit
                unit.succesefulKill(this)
                unit.addGold(this.gold_revard)
            }

            this.setState(new EnemyDyingState())
        }

        this.level.addSound(this.getWeaponHitedSound())
    }

    getWeaponHitedSound() {
        return {
            name: 'sword hit',
            x: this.x,
            y: this.y,
        }
    }

    getState(): void {
        if (this.is_dead) {
            this.setState(this.getDeadStateInstance())
        } else if (this.is_spawning) {
            this.setState(new EnemySpawnState())
        } else {
            this.sayPhrase()
            this.setState(this.getIdleStateInstance())
        }
    }

    getIdleStateInstance() {
        return new EnemyMeleeIdleState()
    }

    public sayPhrase(): void {
        if (!Func.chance(1)) return

        let phrase = new SmallTextLanguage2(this.level)
        phrase.z = this.say_z
        phrase.setPoint(this.x, this.y)

        this.level.effects.push(phrase)
    }
}
