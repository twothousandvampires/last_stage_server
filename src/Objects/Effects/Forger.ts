import Func from "../../Func";
import Level from "../../Level";
import Effect from "./Effects";

export default class Forger extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'forger'

        this.box_r = 1.8
        this.zone_id = 1
        this.x = 165
        this.y = 50
    }

    act(time: number){
        this.level.players.forEach(elem => {
            if(Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())){
                elem.showForgings()
            } 
            else{
                elem.closeForgings()
            }
        })
    }
}