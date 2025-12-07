import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default abstract class Status {
    unit: Unit | undefined
    last_checked: number
    need_to_check_resist: boolean = false
    name: string | undefined
    power: number | undefined
    duration: any = false

    constructor(public time: number) {
        this.last_checked = time
    }

    checkResist(player: Unit | Character) {
        if (!this.need_to_check_resist) {
            return false
        } else {
            return player.isStatusResist()
        }
    }

    setTime(time: number) {
        this.time = time
    }

    isExpired(tick_time: number) {
        if (!this.duration) {
            return false
        }
        return tick_time - this.time >= this.duration
    }

    setDuration(duration: number) {
        this.duration = duration
    }

    setPower(power: number) {
        this.power = power
    }

    unitDead() {}

    clear() {}

    update(status: any) {
        this.time = Date.now()
    }

    act(tick_time: number) {}

    abstract apply(unit: any): void
}
