import Status from './Status'

export default class BlessedArmourStatus extends Status {
    constructor(public time: number) {
        super(time)
    }

    apply(unit: any) {
        this.unit = unit
        unit.armour_rate += 20

        this.unit.newStatus({
            name: 'blessed armour',
            duration: this.duration,
            desc: 'armour are increased',
        })
    }

    clear(): void {
        this.unit.armour_rate -= 20
    }

    update(status: Status) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'blessed armour',
            duration: this.duration,
            desc: 'armour are increased',
        })
    }
}
