import Status from "./Status"

export default class BannerOfArmourStatus extends Status{

    constructor(public time: number,public duration: number){
        super(time, duration)
    }

    apply(unit: any){
        this.unit = unit
        unit.armour_rate += 15
    }

    clear(): void {
        this.unit.armour_rate -= 15
    }
}