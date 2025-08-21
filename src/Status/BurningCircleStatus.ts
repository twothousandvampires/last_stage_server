import Func from "../Func"
import BurningCircleEffect from "../Objects/Effects/BurningCircleEffect"
import Status from "./Status"

export default class BurningCircleStatus extends Status{

    radius: number
    x: any
    y: any
    effect: any

    constructor(public time: number){
        super(time)
        this.radius = 10
        this.name = 'burning circle'
    }

    clear(){
        this.unit.level.deleted.push(this.effect.id)
        this.unit.level.bindedEffects = this.unit.level.bindedEffects.filter(elem => elem != this.effect)
    }

    apply(unit: any){
        this.unit = unit

        let effect = new BurningCircleEffect(this.unit.level)
        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)

        this.effect = effect

        unit.level.bindedEffects.push(effect)
    }

    act(tick_time: number){
        if(tick_time > this.last_checked){
            this.last_checked += 200

            let box = this.unit.getBoxElipse()
            box.r = 20

            this.unit.level.enemies.forEach(elem => {
                if(Func.elipseCollision(box, elem.getBoxElipse())){
                    elem.takeDamage(this.unit, {
                        burn: true
                    })
                }
            })
        }
    }
}