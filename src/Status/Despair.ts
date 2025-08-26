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
                desc: 'lose resourse when get damage'
            })
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.when_hited_triggers = this.unit.when_hited_triggers.filter(elem => elem != this)
        }
    }

     update(status: any){
        this.time = Date.now()

         this.unit.newStatus({
            name: 'despair',
            duration: this.duration,
            desc: 'lose resourse when get damage'
        })
    }

    trigger(){
        this.unit.resource -= 2
    }
}