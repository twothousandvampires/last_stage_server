import Character from '../Objects/src/Character'
import Status from './Status'

export default class CommandsStatus extends Status {
    constructor(
        public time: number,
        public add_ms: number = 0,
        public add_armour: number = 0
    ) {
        super(time)
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.move_speed_penalty += this.add_ms
            this.unit.armour_rate += this.add_armour

            this.unit.newStatus({
                name: 'commands',
                duration: this.duration,
                desc: 'move speed and armour are increased',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.move_speed_penalty -= this.add_ms
            this.unit.armour_rate -= this.add_armour
        }
    }
}
