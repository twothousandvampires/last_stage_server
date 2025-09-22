import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Fragility extends Status {
   
    name: string
    
    constructor(public time: number){
        super(time)
        this.name = 'fragility'
        this.need_to_check_resist = true
    }

    apply(unit: any){
        this.unit = unit
        this.unit.fragility += this.power

        if(this.unit instanceof Character){
            this.unit.statusWasApplied()
            this.unit.newStatus({
                name: 'fragility',
                duration: this.duration,
                desc: 'you can get double damage (' + (this.power > 100 ? 100 : this.power) + '%)'
            })
        }
    }

    update(status: any): void {
        if(status.power > this.power){
            this.unit.fragility -= this.power
            this.power = status.power
            this.unit.fragility += this.power
        }   
       
        this.time = Date.now()

        if(this.unit instanceof Character){
                this.unit.newStatus({
                name: 'fragility',
                duration: this.duration,
                desc: 'you can get double damage (' + (this.power > 100 ? 100 : this.power) + '%)'
            })
        }
        
    }

    clear(){
        this.unit.fragility -= this.power
    }
}