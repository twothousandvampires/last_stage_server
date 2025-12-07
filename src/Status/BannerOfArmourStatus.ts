import Status from './Status'

export default class BannerOfArmourStatus extends Status {
    constructor(public time: number) {
        super(time)
    }

    apply(unit: any) {
        this.unit = unit
        unit.armour_rate += 15
        unit.fortify += 10
    }

    clear(): void {
        this.unit.armour_rate -= 15
        this.unit.fortify -= 10
    }
}
