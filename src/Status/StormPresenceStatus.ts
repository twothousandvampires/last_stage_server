import Func from "../Func"
import { Spark } from "../Objects/Projectiles/Spark"
import Status from "./Status"

export default class StormPresenceStatus extends Status{

    chance: number

    constructor(time: number){
        super(time)
        this.name = 'storm presence'
        this.chance = 0
    }

    apply(unit: any){
        this.unit = unit
    }

    act(tick_time: number){
        if(tick_time > this.last_checked){
            this.last_checked += 1500
            if(!this.unit) return

            this.unit.level.enemies.forEach(elem => {
                if(elem.zaped && Func.distance(this.unit, elem) <= 15){
                    let count = 3
                    let zones = 6.28 / count
                    
                    for(let i = 1; i <= count; i++){
                        let min_a = (i - 1) * zones
                        let max_a = i * zones
            
                        let angle = Math.random() * (max_a - min_a) + min_a
                        let proj = new Spark(elem.level)
                        proj.setAngle(angle)
                        proj.setPoint(elem.x, elem.y)
                        proj.setOwner(this.unit)
            
                        elem.level.projectiles.push(proj)
                    }

                    return
                }
            })
        }
    }

    update(status: any): void {
        this.power += status.power
    }
}