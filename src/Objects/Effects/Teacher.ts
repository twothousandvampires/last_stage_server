import Func from "../../Func.js";
import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class Teacher extends Effect{
    constructor(level: Level){
        super(level)
        this.name = 'teacher'

        this.box_r = 1.8
        this.zone_id = 1
        this.x = 180
        this.y = 40
    }

    act(time: number){
        this.level.players.forEach(elem => {
            if(elem.can_generate_upgrades && Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())){
                elem.generateUpgrades()
                elem.showUpgrades()
            } 
            else{
                elem.closeUpgrades()
            }
        })
    }
}