import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Fortify extends Status{

    constructor(public time: number){
        super(time)
        this.name = 'fortify'
    }

    apply(unit: any){
        this.unit = unit
        if(this.unit instanceof Character){
            this.unit.armour_rate += 15

            this.unit.newStatus({
                name: 'fortify ',
                duration: this.duration,
                desc: 'armour is increased by 15'
            })
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.armour_rate -= 15
        }
    }

    update(status: any){
        this.time = Date.now()
        
        this.unit.newStatus({
            name: 'fortify',
            duration: this.duration,
             desc: 'armour is increased by 15'
        })
    }
}