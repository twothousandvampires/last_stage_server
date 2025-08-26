import Func from "../../../Func";
import Level from "../../../Level";
import Blind from "../../../Status/Blind";
import Pile from "./Pile";

export default class PileOfVeil extends Pile{

    constructor(level: Level){
        super(level)
        this.frequency = 2000
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

            this.level.players.forEach(elem => {
                if(Func.elipseCollision(e, elem.getBoxElipse())){
                    let status = new Blind(elem.time)
                    status.setDuration(5000)
                    this.level.setStatus(elem, status, true)
                }
            })
        }
    }
}