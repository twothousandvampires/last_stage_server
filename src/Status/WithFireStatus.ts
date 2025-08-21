import Func from "../Func"
import { FlameWallObject } from "../Objects/Projectiles/FlameWallObject"
import Status from "./Status"

export default class WithFireStatus extends Status{
   
    last_checked: number
    name: string

    constructor(public time: number){
        super(time)
        this.last_checked = time
        this.name = 'with fire status'
    }

    apply(unit: any){
        this.unit = unit
    }

    update(status: any){
        this.power ++
    }

    act(tick_time: number){
        if(tick_time > this.last_checked){
            this.last_checked += 4500

            let distance_x = Func.random(10, 20)
            let distance_y = Func.random(10, 20)

            let fire = new FlameWallObject(this.unit.level)
            fire.box_r += this.power * 0.4

            if(this.power > 2){
                fire.frendly_flame = true
            }
          
            fire.setOwner(this.unit)
            let angle = Math.random() * 6.28
            fire.setPoint(this.unit.x + Math.sin(angle) * distance_x, this.unit.y + Math.sin(angle) * distance_y)

            this.unit.level.projectiles.push(fire)
        }
    }
}