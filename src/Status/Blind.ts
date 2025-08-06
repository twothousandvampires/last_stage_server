import Func from "../Func"
import Blood from "../Objects/Effects/Blood"
import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Blind extends Status{

    constructor(public time: number,public duration: number){
        super(time, duration)
        this.need_to_check_resist = true
    }

    apply(unit: any){
        this.unit = unit

        if(this.unit instanceof Character){
            this.unit.statusWasApplied()
            this.unit.light_r -= 8

            this.unit.newStatus({
                name: 'blind',
                duration: this.duration,
                desc: 'you are blinded'
            })
        }
    }

    clear(){
        this.unit.light_r += 8
    }

    update(status: any){
        this.time = Date.now()

        this.unit.newStatus({
                name: 'blind',
                duration: this.duration,
                desc: 'you are blinded'
        })
    }
}