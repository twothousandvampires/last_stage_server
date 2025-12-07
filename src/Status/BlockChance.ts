import Character from '../Objects/src/Character'
import Status from './Status'

export default class BlockChance extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'block chance'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.chance_to_block += this.power

            this.unit.newStatus({
                name: 'block chance',
                duration: this.duration,
                desc: 'you block chance is increased',
            })
        }
    }

    clear() {
        this.unit.chance_to_block -= this.power
    }

    update(status: any) {
        this.time = Date.now()

        if (this.unit instanceof Character) {
            this.power += status.power
            this.unit.chance_to_block += status.power

            this.unit.newStatus({
                name: 'block chance',
                duration: this.duration,
                desc: 'you block chance is increased',
            })
        }
    }
}
