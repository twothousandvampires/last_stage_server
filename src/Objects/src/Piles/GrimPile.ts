import Func from "../../../Func";
import Level from "../../../Level";
import GrimPileStatus from "../../../Status/GrimPileStatus";
import Pile from "./Pile";

export default class GrimPile extends Pile{

    increased_effect: boolean
    resistance: boolean

    constructor(level: Level, public power: number = 0){
        super(level)
        this.frequency = 2000
        this.increased_effect = false
        this.resistance = false
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
                    let status = new GrimPileStatus(elem.time, 2000)
                    status.add_armour += this.power
                    status.add_speed += this.power / 15
                    if(this.increased_effect){
                        status.add_armour += 10
                        status.add_speed += 0.1
                    }
                    if(this.resistance){
                        status.add_resistance += 15
                    }
                    this.level.setStatus(elem, status, true)
                }
            })
        }
    }
}