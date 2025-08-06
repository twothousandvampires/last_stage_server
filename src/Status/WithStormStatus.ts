import Func from "../Func"
import LightningBoltEffect from "../Objects/Effects/LightningBoltEffect"
import Status from "./Status"

export default class WithStormStatus extends Status{
    
    last_checked: number
    name: string

    constructor(public time: number,public duration: number, public power: number){
        super(time, duration)
        this.last_checked = time
        this.name = 'with storm status'
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
            let check_distance = 20

            let area = this.unit.getBoxElipse()
            area.r = check_distance

            let targets = this.unit.level.enemies.filter(elem => Func.elipseCollision(elem.getBoxElipse(), area))
            let random_target = targets[Math.round(Math.random() * targets.length)]

            if(random_target){
                let effect = new LightningBoltEffect(this.unit.level)
                effect.setPoint(random_target.x, random_target.y)
                this.unit.level.effects.push(effect)

                let hit_area = {
                    x: random_target.x,
                    y: random_target.y,
                    r: 5
                }

                let targets_to_hit = this.unit.level.enemies.filter(elem => Func.elipseCollision(elem.getBoxElipse(), hit_area))
                this.unit.level.addSound('lightning bolt', random_target.x, random_target.y)

                targets_to_hit.forEach(elem => {
                    let timer = Func.random(100, 2000)
                    elem.setZap(timer)
                })
            }
        }
    }
}