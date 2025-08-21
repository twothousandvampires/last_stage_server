import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Precision extends Status{
   
    name: string
    
    constructor(public time: number){
        super(time)
        this.name = 'precision'
    }

    apply(unit: any){
        this.unit = unit

        if(this.unit instanceof Character){
            this.unit.critical += this.power
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'precision',
                duration: this.duration,
                desc: 'you can lead double damage (' + (this.power > 100 ? 100 : this.power) + '%)'
            })
        }
    }

    update(status: any): void {
        this.unit.critical += status.power
        this.power += status.power

        this.time = Date.now()

        this.unit.newStatus({
            name: 'precision',
            duration: this.duration,
            desc: 'you can lead double damage (' + (this.power > 100 ? 100 : this.power) + '%)'
        })
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.critical -= this.power
        }
    }
}