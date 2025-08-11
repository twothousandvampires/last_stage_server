import Func from "../../Func";
import Level from "../../Level";
import Effect from "./Effects";

export default class Split extends Effect{
    time: number
    
    constructor(level: Level){
        super(level)
        this.name = 'split'
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
                elem.light_r += 3
                elem.addLife()
                setTimeout(() => {
                    elem.light_r -= 3
                }, 10000)

                // let e = this.level.statusPull.filter(s => s.unit === elem)
                // if(e[0]){
                //     e[0].clear()
                //     this.level.statusPull = this.level.statusPull.filter(s => s != e[0])
                // }
                
                this.level.deleted.push(this.id)
                this.level.bindedEffects = this.level.bindedEffects.filter(elem => elem != this)
            }
        })
    }

}