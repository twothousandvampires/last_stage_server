import Level from "../../../Level";
import Bleed from "../../../Status/Bleed";
import Grace from "../../Effects/Grace";
import Manifistation from "./Manifistation";

export class AscentManifistation extends Manifistation {

    constructor(level: Level){
        super(level)
        this.name = 'ascent manifistation'
    }

    activate(): void {
        let s = new Bleed(this.level.time)
        s.setDuration(3000 + this.stage * 1000)

        this.level.setStatus(this.activated_by, s, true)
    }

    giveReward(){
        if(this.stage === 0) return
        if(!this.activated_by) return

        this.level.script.portal_is_exist = this.level.binded_effects.some(elem => elem instanceof Grace)
                
        if(this.level.script.portal_is_exist){
           let portal = this.level.binded_effects.find(elem => elem instanceof Grace)

           if(portal && this.activated_by.zone_id === 0){
                portal.setPoint(this.activated_by.x, this.activated_by.y)
           }
                
        }
        else{
            let portal: Grace = new Grace(this.level, 5000 + this.stage * 3000)

            portal.setPoint(this.activated_by.x, this.activated_by.y)

            this.level.binded_effects.push(portal)
        }
    }
}