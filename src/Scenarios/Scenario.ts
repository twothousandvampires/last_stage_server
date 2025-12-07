import Level from '../Level'

export default abstract class Scenario {
    map: any
    started_time: number

    constructor() {
        this.map = []
        this.started_time = Date.now()
    }

    checkTime(level: Level): void {
        let time_elapsed = level.time - this.started_time

        let next_action = this.map[0]

        if (next_action && next_action.time <= time_elapsed) {
            next_action.action(level)
            this.map.shift()
        }
    }

    abstract start(level: Level): void

    getInfo() {
        return false
    }
}
