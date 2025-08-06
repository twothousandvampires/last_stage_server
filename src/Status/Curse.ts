import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Curse extends Status{
 
    constructor(public time: number,public duration: number){
        super(time, duration)
        this.name = 'curse'
        this.need_to_check_resist = true
    }

    apply(unit: any){
        this.unit = unit

        if(this.unit instanceof Character){
            this.unit.can_use_skills = false
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'curse',
                duration: this.duration,
                desc: 'cannot use abilities'
            })
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.can_use_skills = true
        }
    }
}