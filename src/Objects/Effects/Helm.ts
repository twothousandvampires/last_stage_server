import Func from "../../Func";
import Level from "../../Level";
import Effect from "./Effects";

export default class Helm extends Effect{
    time: number
    
    constructor(level: Level){
        super(level)
        this.name = 'helm'
        this.box_r = 3.2
        this.time = Date.now()
    }

    act(time: number){
        if(time - this.time >= 10000){
            this.delete()
            return
        }

        this.level.players.forEach(elem => {
            let col = Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())
            if(col){
                elem.addAscent()
 
                let r = Func.random(1,6)
                if(r === 1){
                    elem.might ++
                }
                else if(r === 2){
                    elem.durability ++
                }
                else if(r === 3){
                    elem.knowledge ++
                }
                else if(r === 4){
                    elem.will ++
                }
                else if(r === 5){
                    elem.agility ++
                }
                else{
                    elem.perception ++
                }

                this.level.deleted.push(this.id)
                this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
            }
        })
    }
}