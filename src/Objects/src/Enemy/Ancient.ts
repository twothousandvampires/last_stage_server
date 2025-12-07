import Func from '../../../Func'
import FlameRing from '../../../Items/FlameRing'
import Level from '../../../Level'
import AncientIdleState from '../../../State/AncientIdleState'
import ChainLightningTrigger from '../../../Triggers/ChainLightningTrigger'
import Hurricane from '../../../Triggers/Hurricane'
import MindBurst from '../../../Triggers/MindBurst'
import Wrath from '../../../Triggers/Wrath'
import Soul from '../../Effects/Soul'
import Character from '../Character'
import Enemy from './Enemy'

export default class Ancient extends Enemy {
    target: any
    duration: number = 20000
    hitCount: any
    last_hit_time: number = 0
    chance: number = 7
    statusPull: any = []

    constructor(level: Level) {
        super(level)
        this.name = 'ancient'
        this.box_r = 2
        this.create_chance = 0
        this.count_as_killed = true
        this.immune_to_freeze = true
        this.immune_to_stun = true
        this.immune_to_zap = true
        this.life_status = 666666
        this.has_boby = false
        this.is_spawning = false
        this.phasing = true
        this.move_speed = 0.2
        this.can_be_instant_killed = false
        this.hitCount = new Map()
        this.statusPull = [
            new Hurricane(),
            new FlameRing(),
            new ChainLightningTrigger(),
            new Wrath(),
            new MindBurst(),
        ]
    }

    giveRevard() {
        let max = 0
        let id = undefined

        while (this.hitCount.size > 0) {
            for (let [char_id, hit_count] of this.hitCount) {
                if (hit_count > max) {
                    max = hit_count
                    id = char_id
                }
            }

            if (id != undefined && Func.chance(max * this.chance)) {
                let t = Func.getRandomFromArray(this.statusPull)
                let char = this.level.players.find(elem => elem.id === id)

                if (char && t) {
                    let chance = max
                    if (chance < 5) {
                        chance = 5
                    }

                    t.chance = chance

                    let r = Func.random(1, 4)

                    if (r === 1) {
                        char.triggers_on_block.push(t)
                        this.level.addMessedge('you have got new on block trigger', id)
                    } else if (r === 2) {
                        char.triggers_on_get_energy.push(t)
                        this.level.addMessedge('you have got new on get energy trigger', id)
                    } else if (r === 3) {
                        char.triggers_on_heal.push(t)
                        this.level.addMessedge('you have got new on heal trigger', id)
                    } else if (r === 4) {
                        char.triggers_on_get_hit.push(t)
                        this.level.addMessedge('you have got new on get hit trigger', id)
                    }
                }

                this.hitCount = new Map()
            } else {
                this.hitCount.delete(id)
                max = 0
                id = undefined
            }
        }
    }

    takeDamage(unit?: any, options?: any): void {
        if (this.level.time - this.last_hit_time < 1000) {
            return
        }
        if (unit && unit instanceof Character) {
            this.last_hit_time = this.level.time
            this.move_speed_penalty += 10

            let e = new Soul(this.level)
            e.setPoint(this.x, this.y)

            this.level.addEffect(e)
            this.level.addSound('bone cast', this.x, this.y)

            if (this.hitCount.has(unit.id)) {
                let hits = this.hitCount.get(unit.id)
                this.hitCount.set(unit.id, hits + 1)
            } else {
                this.hitCount.set(unit.id, 1)
            }
        }
    }

    getIdleStateInstance() {
        return new AncientIdleState()
    }
}
