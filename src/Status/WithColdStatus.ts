import Func from "../Func"
import FrostExplosionBig from "../Objects/Effects/FrostExplosionBig"
import Status from "./Status"

export default class WithColdStatus extends Status{
 
    last_checked: number
    name: string

    constructor(public time: number){
        super(time)
        this.last_checked = time
        this.name = 'with cold status'
    }

    apply(unit: any){
        this.unit = unit
    }

    update(status: any){
        this.power ++
    }

    act(tick_time: number){
        if(tick_time > this.last_checked){
            this.last_checked += 5000 - this.power * 200

            let distance_x = Func.random(10, 20)
            let distance_y = Func.random(10, 20)
            
            let angle = Math.random() * 6.28

            let point = {
                x: this.unit.x + Math.sin(angle) * distance_x,
                y: this.unit.y + Math.sin(angle) * distance_y,
                r: 3 + this.power
            }

            let e = new FrostExplosionBig(this.unit.level)
            e.setPoint(point.x, point.y)
            this.unit.level.effects.push(e)
         
            let enemies = this.unit.level.enemies
            let players = this.unit.level.players

            enemies.forEach((elem) => {
                if(Func.elipseCollision(point, elem.getBoxElipse())){
                    elem.setFreeze(1500)
                }
            })

            players.forEach((elem) => {
                if(elem != this.unit && Func.elipseCollision(point, elem.getBoxElipse())){
                    elem.setFreeze(1500)
                }
            })
        }
    }
}