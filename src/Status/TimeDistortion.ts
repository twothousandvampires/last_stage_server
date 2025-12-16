import Character from '../Objects/src/Character'
import Status from './Status'

export default class TimeDistortion extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'time distortion'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.cooldown_redaction += 70
            this.unit.chance_to_trigger_additional_time += 50
            this.unit.first_ability.mastery_chance += 20
            this.unit.second_ability.mastery_chance += 20
            this.unit.third_ability.mastery_chance += 20
            this.unit.utility.mastery_chance += 20

            this.unit.newStatus({
                name: 'time distortion',
                duration: this.duration,
                desc: 'Cooldown reduction rate increased by 70, double trigger chance increased by 50, mastery proc chance increased by 20',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.cooldown_redaction -= 70
            this.unit.chance_to_trigger_additional_time -= 50
            this.unit.first_ability.mastery_chance -= 20
            this.unit.second_ability.mastery_chance -= 20
            this.unit.third_ability.mastery_chance -= 20
            this.unit.utility.mastery_chance -= 20
        }
    }
}