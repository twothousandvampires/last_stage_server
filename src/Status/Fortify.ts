import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Fortify extends Status {

    power: number | undefined = 10

    constructor(public time: number){
        super(time)
        this.name = 'fortify'
    }

    apply(unit: any){
        this.unit = unit
        this.unit.fortify += this.power

        if(this.unit instanceof Character){
            this.unit.newStatus({
                name: 'fortify',
                duration: this.duration,
                desc: 'you have a chance to get half damage (' + this.power +'%)'
            })
        }
    }

    clear(){
        this.unit.fortify -= this.power
    }

    update(status: any){
        this.time = Date.now()

        this.power += status.power
        this.unit.fortify += status.power

        if(this.unit instanceof Character){
             this.unit.newStatus({
                name: 'fortify',
                duration: this.duration,
                desc: 'you have a chance to get half damage (' + this.power +'%)'
            })
        }
       
    }
}