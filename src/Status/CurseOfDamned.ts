import Character from "../Objects/src/Character"
import CurseOfDamnedEffect from '../Objects/Effects/CurseOfDamnedEffect'
import Curse from "./Curse"
import CureseOfDamnedArea from "../Objects/Effects/CureseOfDamnedArea"
import Func from "../Func"
import Status from "./Status"

export default class CurseOfDamned extends Status{

    effect: any

    constructor(public time: number){
      super(time)
      this.need_to_check_resist = true
    }

    apply(unit: any){
        this.unit = unit

        this.effect = new CurseOfDamnedEffect(this.unit.level)
        this.effect.setOwner(this.unit)

        this.unit.statusWasApplied()
            
        this.unit.level.bindedEffects.push(this.effect)
    }

    clear(){
        if(this.unit instanceof Character){

            let ppl = this.unit.level.players.filter(elem => Func.distance(elem, this.unit) <= 20)

            ppl.forEach(elem => {
                let s = new Curse(elem.time)
                s.setDuration(5000)
                this.unit.level.setStatus(elem, s)
            })

            let e = new CureseOfDamnedArea(this.unit.level)
            e.setPoint(this.unit.x, this.unit.y)
            this.unit.level.effects.push(e)

            this.unit.level.deleted.push(this.effect.id)
            this.unit.level.bindedEffects = this.unit.level.bindedEffects.filter(e => e != this.effect)
        }
    }
}