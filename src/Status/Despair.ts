import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Despair extends Status{
   
    name: string
    
    constructor(public time: number){
        super(time)
        this.name = 'despair'
        this.need_to_check_resist = true
    }

    apply(unit: any){
        this.unit = unit
        if(this.unit instanceof Character){
            this.unit.when_hited_triggers.push(this)

            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'despair',
                duration: this.duration,
                desc: 'lose resourse over time and when get damage'
            })
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.when_hited_triggers = this.unit.when_hited_triggers.filter(elem => elem != this)
        }
    }

    act(tick: number){
        if(this.tick - this.last_checked >= 2000){
            this.last_checked = this.tick
            
            if(this.unit.resource > 0){
                this.unit.resource -= 1
            }
        }
    }

     update(status: any){
        this.time = Date.now()

         this.unit.newStatus({
            name: 'despair',
            duration: this.duration,
            desc: 'lose resourse over time and when get damage'
        })
    }

    trigger(){
        this.unit.resource = 0
    }
}