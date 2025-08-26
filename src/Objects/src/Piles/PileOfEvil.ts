import Func from "../../../Func";
import Level from "../../../Level";
import PileOfEvilStatus from "../../../Status/PileOfEvilStatus";
import Pile from "./Pile";

export default class PileOfEvil extends Pile{

    constructor(level: Level){
        super(level)
        this.frequency = 3000
        this.getState()
    }

    castAct(){
        if(this.action && !this.hit){
            this.hit = true

            this.level.sounds.push({
                name:'dark cast',
                x: this.x,
                y: this.y
            })

            let e = this.getBoxElipse()
            e.r = 15

            this.level.enemies.forEach(elem => {
                if(Func.elipseCollision(e, elem.getBoxElipse())){
                    let status = new PileOfEvilStatus(this.level.time)
                    status.setDuration(4000)
                    this.level.setStatus(elem, status)
                }
            })
        }
    }
}