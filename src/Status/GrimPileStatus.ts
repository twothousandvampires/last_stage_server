import Character from "../Objects/src/Character"
import Status from "./Status"

export default class GrimPileStatus extends Status{

    name: string
    add_armour: number
    add_speed: number
    add_resistance: number

    constructor(public time: number,public duration: number){
        super(time, duration)
        this.name = 'grim pile status'
        this.add_armour = 10
        this.add_speed = 0.1
        this.add_resistance = 0
    }

    apply(unit: any){
        this.unit = unit
        if(this.unit instanceof Character){
            this.unit.armour_rate += this.add_armour
            this.unit.move_speed += this.add_speed
            this.unit.status_resistance += this.add_resistance
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.armour_rate -= this.add_armour
            this.unit.move_speed -= this.add_speed
            this.unit.status_resistance -= this.add_resistance
        }
    }
}