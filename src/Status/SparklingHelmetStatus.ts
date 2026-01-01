import Func from '../Func'
import BigShockNova from '../Objects/Effects/BigShockNova'
import Status from './Status'

export default class SparklingHelmetStatus extends Status {
    time_beetween_proc: number = 5000
    last_trigger_time: number
    public disabled: boolean = false

    constructor(time: number) {
        super(time)
        this.last_trigger_time = time
    }

    unitDead() {}

    apply(unit: any) {
        this.unit = unit
    }

    clear() {}

    update(status: any) {}

    checkResist() {
        return false
    }

    isExpired() {
        return false
    }

    act(tick_time: number) {
        if (!this.unit) return

        if (tick_time - this.unit.last_time_the_skill_was_used >= this.time_beetween_proc) {
            if (tick_time >= this.last_trigger_time) {
                this.trigger()
                this.last_trigger_time = tick_time + this.time_beetween_proc
            }
        }
    }

    trigger() {
        if (this.disabled) return

        let e = new BigShockNova(this.unit.level)

        e.setOwner(this.unit)
        e.setPoint(this.unit.x, this.unit.y)

        this.unit.level.effects.push(e)

        let enemies = this.unit.level.enemies
        let players = this.unit.level.players

        let targets = enemies.concat(players)
        let wave = this.unit.getBoxElipse()
        wave.r = 20

        this.unit.level.addSound('static', this.unit.x, this.unit.y)
        let was_sound = false
        targets.forEach(elem => {
            if (
                !elem.is_dead &&
                elem.z < 1 &&
                Func.elipseCollision(wave, elem.getBoxElipse()) &&
                elem != this.unit
            ) {
                let timer = Func.random(1500, 2500)
                elem.setZap(timer)
                if (!was_sound) {
                    this.unit.level.addSound('zap', elem.x, elem.y)
                    was_sound = true
                }
            }
        })
    }
}
