import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class BoneArmour extends Effect{
    x: any
    y: any
    value: number
    max_value: number
    start: number
    duration: number
    
    constructor(level: Level){
        super(level)
        this.name = 'bone armour'
        this.x = undefined
        this.y = undefined
        this.value = 0
        this.max_value = 10
        this.start = Date.now()
        this.duration = 5000
    }

    act(){
        if(Date.now() - this.start > this.duration){
            this.clear()
            return
        }
        if(!this.owner){
             return
        }  
        
        this.x = this.owner.x
        this.y = this.owner.y
    }

    setOwner(character){
        this.owner = character
    }

    apply(){
        this.owner.armour_rate += this.value
    }

    clear(){
        this.owner.armour_rate -= this.value
        this.value = 0

        this.level.deleted.push(this.id)
        this.producer.effect = undefined

        this.level.bindedEffects = this.level.bindedEffects.filter(e => e != this)
    }

    update(adds_duration = 0){
        this.start = Date.now()
        this.duration += adds_duration
        this.value += 1
        this.owner.armour_rate += 1
        this.owner.newStatus({
            name: 'wall of bones',
            duration: this.duration,
            desc: 'armour is increased(' + this.value + ')'
        })
    }

    isMax(){
        return this.value >= this.max_value
    }
}