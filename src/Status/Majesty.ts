import Character from '../Objects/src/Character'
import Status from './Status'

export default class Majesty extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'majesty'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.avoid_damage_chance += 50
            this.unit.impact += 50
            this.unit.armour_rate += 50
            this.unit.fortify += 50

            this.unit.newStatus({
                name: 'majesty',
                duration: this.duration,
                desc: 'Your impact, armour, fortification and avoid damage rating are increased by 50',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.avoid_damage_chance -= 50
            this.unit.impact -= 50
            this.unit.armour_rate -= 50
            this.unit.fortify -= 50
        }
    }
}