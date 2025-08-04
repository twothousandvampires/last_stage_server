import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Weakness extends Status{
  
    name: string

    constructor(public time: number,public duration: number){
        super(time, duration)
        this.name = 'weakness'
        this.need_to_check_resist = true
    }

    apply(unit: any){
        this.unit = unit
        if(this.unit instanceof Character){
            this.unit.can_regen_resource = false
            this.unit.statusWasApplied()
            
            this.unit.newStatus({
                name: 'weakness',
                duration: this.duration,
                desc: 'weakness'
            })
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.can_regen_resource = true
        }
    }

    update(status: any){
        this.time = Date.now()
        
        this.unit.newStatus({
            name: 'weakness',
            duration: status.duration,
            desc: 'weakness'
        })
    }
}