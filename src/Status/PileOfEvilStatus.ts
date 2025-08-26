import Status from "./Status"

export default class PileOfEvilStatus extends Status{

    name: string

    constructor(public time: number){
        super(time)
        this.name = 'pile of evil status'
    }

    apply(unit: any){
        this.unit = unit
        
        this.unit.move_speed += 0.2
        this.unit.attack_speed -= 200
        this.unit.armour_rate += 10
    }

    clear(){
        this.unit.move_speed -= 0.2
        this.unit.attack_speed += 200
        this.unit.armour_rate -= 10
    }

}