import Character from '../Objects/src/Character'
import Status from './Status'

export default class LethalStrikes extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'lethal strikes'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.chance_to_instant_kill += 10
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'lethal strikes',
                duration: this.duration,
                desc: 'Chance to instant kill is increased',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.chance_to_instant_kill -= 10
        }
    }

    update(status: any) {
        this.time = Date.now()
    
        if (this.unit instanceof Character) {
            this.unit.newStatus({
                name: 'lethal strikes',
                duration: this.duration,
                desc: 'Chance to instant kill is increased',
            })
        }
    }
}