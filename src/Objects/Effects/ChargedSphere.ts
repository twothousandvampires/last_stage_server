import Func from "../../Func.js";
import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class ChargedSphere extends Effect{
    x: any
    y: any
    time: number
    
    constructor(level: Level){
        super(level)
        this.name = 'charged sphere'
        this.x = undefined
        this.y = undefined
        this.box_r = 2
        this.time = Date.now()
    }

    act(time: number){
        if(time - this.time >= 10000){
            this.level.deleted.push(this.id)
            this.level.bindedEffects = this.level.bindedEffects.filter(elem => elem != this)
            return
        }

        this.level.players.forEach(elem => {
            if(Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())){
                if(elem.can_regen_resource){
                    elem.addResourse(2)
                }
                this.level.deleted.push(this.id)
                this.level.bindedEffects = this.level.bindedEffects.filter(elem => elem != this)
                elem.move_speed += 0.1
                setTimeout(() => {
                    elem.move_speed -= 0.1
                }, 5000)
            } 
        })
    }
}