import { Spark } from "../../Objects/Projectiles/Spark";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Sparks extends FlyerAbility{

    cost: number
    pierce: number = 1
    ttl: number = 3000
  
    constructor(owner: Flyer){
        super(owner)
        this.cost = 8
        this.name = 'sparks'
        this.need_to_pay = true
    }
    
    impact(){
        let count = 10 + this.owner.getAdditionalRadius()
        let zones = 6.28 / count

        for(let i = 1; i <= count; i++){
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a

            let proj = new Spark(this.owner.level, this.pierce, this.ttl)
            
            proj.setStart(this.owner.level.time)
            proj.setAngle(angle)
            proj.setPoint(this.owner.x, this.owner.y)
            proj.setOwner(this.owner)

            this.owner.level.projectiles.push(proj)
        }
    }
}