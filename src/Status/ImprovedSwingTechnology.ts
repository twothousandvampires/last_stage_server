import Character from '../Objects/src/Character'
import Status from './Status'

export default class ImprovedSwingTechnology extends Status {
    name: string
    max_stack: number
    stack_count: number

    constructor(public time: number) {
        super(time)
        this.name = 'improved swing technology'
        this.max_stack = 5
        this.stack_count = 1
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.move_speed_penalty += 5
            this.unit.attack_speed -= 100
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.move_speed_penalty -= 5 * this.stack_count
            this.unit.attack_speed += 100 * this.stack_count
        }
    }

    update(status: any) {
        this.time = Date.now()
        if (this.stack_count < this.max_stack) {
            this.stack_count++
            this.unit.move_speed_penalty += 5
            this.unit.attack_speed -= 100
        }
    }
}
