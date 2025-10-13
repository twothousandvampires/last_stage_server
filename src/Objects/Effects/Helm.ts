import Func from "../../Func";
import Level from "../../Level";
import Immortality from "../../Status/Immortality";
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
                elem.ascend_level ++
                elem.free_upgrade_count ++

                this.level.deleted.push(this.id)
                this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
            }
        })
    }
}