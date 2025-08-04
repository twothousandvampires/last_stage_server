import Func from "../Func"
import Character from "../Objects/src/Character"
import Status from "./Status"

export default class CursedWeaponStatus extends Status{
   
    constructor(public time: number,public duration: number, public drinker: boolean = false){
        super(time, duration)
    }

    apply(unit: any){
        this.unit = unit
        if(this.unit instanceof Character){
            this.unit.attack_radius += 4
            this.unit.attack_speed -= 500

            this.unit.newStatus({
                name: 'cursed weapon',
                duration: this.duration,
                desc: 'your weapon is cursed'
            })

            if(this.drinker){
                this.unit.onKillTriggers.push(this)
            }
        }
    }

    trigger(){
        if(Func.chance(10)){
            this.unit.addLife()
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.attack_radius -= 4
            this.unit.attack_speed += 500
            if(this.unit.getSecondResource() * 10 < Func.random()){
                this.unit.takePureDamage()
            }
            if(this.drinker){
                this.unit.onKillTriggers = this.unit.onKillTriggers.filter(elem => elem != this)
            }
        }
    }
}