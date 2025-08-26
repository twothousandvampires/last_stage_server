import Level from "../../../Level";
import { SharpedBone } from "../../Projectiles/SharpedBone";
import Pile from "./Pile";

export default class PileOfDead extends Pile{

    constructor(level: Level){
        super(level)
        this.frequency = 1500
        this.life_status = 1
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

            let count = 20
            
            let zones = 6.28 / count
    
            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new SharpedBone(this.level)
                proj.setAngle(angle)
                proj.setPoint(this.x, this.y)
    
                this.level.projectiles.push(proj)
            }

            this.takeDamage()
        }
    }
}