import Func from "../../Func";
import Level from "../../Level";
import Grace from "../../Status/Grace";
import Effect from "./Effects"

export default class GraceShard extends Effect{
    time: number
    constructor(level: Level){
        super(level)
        this.name = 'grace shard'
        this.box_r = 1.2
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
                elem.grace ++
                let status = new Grace(elem.time, 8000)
                this.level.setStatus(elem, status, true)

                this.level.deleted.push(this.id)
                this.level.bindedEffects = this.level.bindedEffects.filter(elem => elem != this)
            }
        })
    }
}