import Func from "../Func"
import { FlameWallObject } from "../Objects/Projectiles/FlameWallObject"
import Status from "./Status"

export default class WithFireStatus extends Status{
   
    last_checked: number
    name: string

    constructor(public time: number,public duration: number, public power: number){
        super(time, duration)
        this.last_checked = time
        this.name = 'with fire status'
    }

    apply(unit: any){
        this.unit = unit
    }

    update(status: any){
        this.power ++
    }

    isExpired(tick_time: number){
        return false
    }

    act(tick_time: number){
        if(tick_time > this.last_checked){
            this.last_checked += 5000 - (this.power * 200)
            let distance = Func.random(10, 20)

            let fire = new FlameWallObject(this.unit.level)
            fire.setOwner(this.unit)
            let angle = Math.random() * 6.28
            fire.setPoint(this.unit.x + Math.sin(angle) * distance, this.unit.y + Math.sin(angle) * distance)

            this.unit.level.projectiles.push(fire)
        }
    }
}