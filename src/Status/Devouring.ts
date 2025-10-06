import Character from "../Objects/src/Character"
import Exhaustion from "./Exhaustion"
import Status from "./Status"

export default class Devouring extends Status{
   
    name: string
    count: number = 0
    provider: any
    
    constructor(public time: number){
        super(time)
        this.name = 'devouring'
        this.need_to_check_resist = true
    }

    apply(unit: any){
        this.unit = unit
        if(this.unit instanceof Character){
            this.unit.triggers_on_kill.push(this)

            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'devouring',
                duration: this.duration,
                desc: '?'
            })
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.move_speed_penalty -= 1 * this.count
            this.unit.attack_speed += 10 * this.count
            this.unit.cast_speed += 10 * this.count

            let s = new Exhaustion(this.unit.level.time)
            s.setDuration(6000)

            this.unit.level.setStatus(this.unit, s)

            this.provider.status = undefined

            this.unit.triggers_on_kill = this.unit.triggers_on_kill.filter(elem => elem != this)
        }
    }

    update(status: any){
        this.time = Date.now()

        this.unit.newStatus({
            name: 'devouring',
            duration: this.duration,
            desc: '?'
        })
    }

    trigger(){
        if(!this.unit) return

        this.count ++
        this.unit.move_speed_penalty += 1
        this.unit.attack_speed -= 10
        this.unit.cast_speed -= 10

        this.update(this)
    }
}