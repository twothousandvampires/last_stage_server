import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Fragility extends Status{
   
    name: string
    
    constructor(public time: number){
        super(time)
        this.name = 'fragility'
        this.need_to_check_resist = true
    }

    apply(unit: any){
        this.unit = unit

        if(this.unit instanceof Character){
            this.unit.fragility += this.power
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'fragility',
                duration: this.duration,
                desc: 'you can get double damage (' + (this.power > 100 ? 100 : this.power) + '%)'
            })
        }
    }

    update(status: any): void {
        this.unit.fragility += status.power
        this.power += status.power

        this.time = Date.now()

        this.unit.newStatus({
            name: 'fragility',
            duration: this.duration,
            desc: 'you can get double damage (' + (this.power > 100 ? 100 : this.power) + '%)'
        })
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.fragility -= this.power
        }
    }
}