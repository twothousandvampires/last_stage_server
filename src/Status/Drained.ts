import Character from '../Objects/src/Character'
import Status from './Status'

export default class Drained extends Status {
    might_drained: number
    perception_drained: number
    will_drained: number
    knowledge_drained: number
    agility_drained: number
    durability_drained: number
    name: string

    constructor(public time: number) {
        super(time)
        this.might_drained = 0
        this.perception_drained = 0
        this.will_drained = 0
        this.knowledge_drained = 0
        this.agility_drained = 0
        this.durability_drained = 0
        this.name = 'drained'
        this.need_to_check_resist = true
    }

    drain() {
       
        if (this.unit instanceof Character) {
             this.unit.might -= 2
            this.might_drained += 2  

            this.unit.perception -= 2
            this.perception_drained += 2
            
            this.unit.will -= 2
            this.will_drained += 2  
    
            this.unit.knowledge -= 2
            this.knowledge_drained += 2  

            this.unit.durability -= 2
            this.durability_drained += 2  

            this.unit.agility -= 2
            this.agility_drained += 2  
        }
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()
            this.drain()

            this.unit.newStatus({
                name: 'drained',
                duration: this.duration,
                desc: 'your stats are decreased',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.might += this.might_drained
            this.unit.perception += this.perception_drained
            this.unit.durability += this.durability_drained
            this.unit.agility += this.agility_drained
            this.unit.will += this.will_drained
            this.unit.knowledge += this.knowledge_drained
        }
    }

    update(status: any) {
        this.time = Date.now()
        this.drain()
    }
}
