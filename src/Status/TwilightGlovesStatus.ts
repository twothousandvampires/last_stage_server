import Func from "../Func";
import Item from "../Items/Item";
import ShadowDrop from "../Objects/Effects/ShadowDrop";
import Status from "./Status";

export default class TwilightGlovesStatus extends Status{

    last_trigger_time: number
    public disabled: boolean = false

    constructor(time: number, public item: Item){
        super(time)
        this.last_trigger_time = time
    }

    unitDead(){
        
    }

    apply(unit: any){
        this.unit = unit
    }

    clear(){
        
    }

    update(status: any){
        
    }

    checkResist(){
        return false
    }

    isExpired(){
        return false
    }

    act(tick_time: number){
        if(tick_time - this.last_trigger_time >= this.item.frequency){
            this.trigger()
            this.last_trigger_time = tick_time
        }
    }

    trigger(){
        if(this.item.disabled) return
        if(!Func.chance(this.item.chance)) return

        let count = this.item.count
        let b = this.unit.getBoxElipse()
        b.r = this.item.distance

        let t = this.unit?.level.enemies.filter(elem => Func.elipseCollision(elem.getBoxElipse(), b))

        if(t && t.length){
            for(let i = 0; i < count; i++){
                let r = t[Math.floor(Math.random() * t?.length)]

                let e = new ShadowDrop(this.unit?.level)
                e.setPoint(r.x, r.y)

                this.unit?.level.effects.push(e)

                setTimeout(() => {
                    r.takeDamage(this.unit)
                }, 150)
                
            }
        }  
    }
}