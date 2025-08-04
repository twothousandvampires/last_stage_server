import Func from "../Func"
import BannerOfArmourEffect from "../Objects/Effects/BannerOfArmourEffect"
import BannerOfArmourStatus from "./BannerOfArmourStatus"
import Status from "./Status"

export default class BannerOfArmour extends Status{

    radius: number
    x: any
    y: any
    effect: any

    constructor(public time: number,public duration: number){
        super(time, duration)
        this.radius = 10
        this.name = 'banner of armour'
    }

    clear(){
        this.unit.level.deleted.push(this.effect.id)
        this.unit.level.bindedEffects = this.unit.level.bindedEffects.filter(elem => elem != this.effect)
    }

    apply(unit: any){
        this.unit = unit

        let effect = new BannerOfArmourEffect(this.unit.level)
        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)
        this.effect = effect

        unit.level.bindedEffects.push(effect)
    }

    isExpired(tick_time: number){
        return false
    }

    act(tick_time: number){
        if(tick_time > this.last_checked){
            this.last_checked += 2000

            let box = this.unit.getBoxElipse()
            box.r = this.radius

            this.unit.level.enemies.forEach(elem => {
                if(Func.elipseCollision(box, elem.getBoxElipse())){
                    let status = new BannerOfArmourStatus(tick_time, 4000)
                    this.unit.level.setStatus(elem, status)
                }
            })
        }
    }
}