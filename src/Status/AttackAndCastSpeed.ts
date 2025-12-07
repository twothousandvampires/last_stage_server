import Character from '../Objects/src/Character'
import Status from './Status'

export default class AttackAndCastSpeed extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'attack and cast speed'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.attack_speed -= this.power
            this.unit.cast_speed -= this.power

            this.unit.newStatus({
                name: 'action speed',
                duration: this.duration,
                desc: 'attack and cast speed are increased',
            })
        }
    }

    clear() {
        this.unit.attack_speed += this.power
        this.unit.cast_speed += this.power
    }

    update(status: any) {
        this.time = Date.now()

        if (this.unit instanceof Character) {
            this.power += status.power

            this.unit.attack_speed -= status.power
            this.unit.cast_speed -= status.power

            this.unit.newStatus({
                name: 'action speed',
                duration: this.duration,
                desc: 'attack and cast speed are increased',
            })
        }
    }
}
