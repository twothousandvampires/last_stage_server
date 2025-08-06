import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Poison extends Status{
   
    name: string
    
    constructor(public time: number,public duration: number){
        super(time, duration)
        this.name = 'poison'
        this.need_to_check_resist = true
    }

    apply(unit: any){
        this.unit = unit
        if(this.unit instanceof Character){
            this.unit.can_regen_life = false
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'poison',
                duration: this.duration,
                desc: 'poison'
            })
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.can_regen_life = true
        }
    }
}