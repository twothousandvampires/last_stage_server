import Character from "../Objects/src/Character"
import Status from "./Status"

export default class Drained extends Status{
    
    might_drained: number
    speed_drained: number
    will_drained: number
    knowledge_drained: number
    agility_drained: number
    durability_drained: number
    name: string
    
    constructor(public time: number){
      super(time)
      this.might_drained = 0
      this.speed_drained = 0
      this.will_drained = 0
      this.knowledge_drained = 0
      this.agility_drained = 0
      this.durability_drained = 0
      this.name = 'drained'
      this.need_to_check_resist = true
    }

    drain(){
        if(this.unit.might > 0 ){
            this.unit.might --
            this.might_drained ++
        }
        if(this.unit.speed > 0 ){
            this.unit.speed --
            this.speed_drained ++
        }
        if(this.unit.will > 0 ){
            this.unit.will --
            this.will_drained ++
        }
        if(this.unit.knowledge > 0 ){
            this.unit.knowledge --
            this.knowledge_drained ++
        }
        if(this.unit.durability > 0 ){
            this.unit.durability --
            this.durability_drained ++
        }
        if(this.unit.agility > 0 ){
            this.unit.agility --
            this.agility_drained ++
        }
    }

    apply(unit: any){
        this.unit = unit
        if(this.unit instanceof Character){
            this.unit.statusWasApplied()
            this.drain()

            this.unit.newStatus({
                name: 'drained',
                duration: this.duration,
                desc: 'your stats are decreased'
            })
        }
    }

    clear(){
        if(this.unit instanceof Character){
            this.unit.might += this.might_drained
            this.unit.speed += this.speed_drained
            this.unit.durability += this.durability_drained
            this.unit.agility += this.agility_drained
            this.unit.will += this.will_drained
            this.unit.knowledge += this.knowledge_drained
        }
    }

    update(status: any){
        this.time = Date.now()
        this.drain()
    }
}