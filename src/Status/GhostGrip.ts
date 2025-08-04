import Character from "../Objects/src/Character"
import GhostGripEffect from '../Objects/Effects/GhostGrip'
import Status from "./Status"

export default class GhostGrip extends Status{
   
    effect: any
    name: string

    constructor(public time: number,public duration: number){
        super(time, duration)
        this.name = 'ghost grip'
        this.need_to_check_resist = true
    }

    apply(unit: any){
        this.unit = unit
        if(this.unit instanceof Character){
            this.unit.addMoveSpeedPenalty(-50)
            this.unit.statusWasApplied()
            
            this.effect = new GhostGripEffect(this.unit.level)
            this.effect.setOwner(this.unit)

            this.unit.level.bindedEffects.push(this.effect)

            this.unit.newStatus({
                name: 'ghost grip',
                duration: this.duration,
                desc: 'movement is highed reduced'
            })
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.addMoveSpeedPenalty(50)

            this.unit.level.deleted.push(this.effect.id)
            this.unit.level.bindedEffects = this.unit.level.bindedEffects.filter(e => e != this.effect)
        }
    }

    update(status: any){
        this.time = Date.now()

        this.unit.newStatus({
            name: 'ghost grip',
            duration: this.duration,
            desc: 'movement is highed reduced'
        })
    }
}