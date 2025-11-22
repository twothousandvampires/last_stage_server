import Func from "../Func"
import { FlameWallObject } from "../Objects/Projectiles/FlameWallObject"
import Status from "./Status"

export default class WithFireStatus extends Status{

    constructor(time: number){
        super(time)
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

            let check_distance = 14
            
            let area = this.unit.getBoxElipse()
            area.r = check_distance

            let targets = this.unit.level.enemies.filter(elem => Func.elipseCollision(elem.getBoxElipse(), area))
            let random_target = targets[Math.round(Math.random() * targets.length)]

            if(random_target){
                let fire = new FlameWallObject(this.unit.level)
                fire.box_r += 5

                fire.setOwner(this.unit)
                fire.setPoint(random_target.x, random_target.y)

                this.unit.level.projectiles.push(fire)
            }      
        }
    }
}