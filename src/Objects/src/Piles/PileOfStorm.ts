import Func from "../../../Func";
import Level from "../../../Level";
import ShockStatus from "../../../Status/ShockStatus";
import Pile from "./Pile";

export default class PileOfStorm extends Pile{

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

            this.level.players.forEach(elem => {
                if(Func.elipseCollision(e, elem.getBoxElipse())){
                    let status = new ShockStatus(elem.time)
                    status.setDuration(4000)
                    status.setPower(25)
                    this.level.setStatus(elem, status)
                }
            })
        }
    }
}