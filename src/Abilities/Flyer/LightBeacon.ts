import Func from "../../Func";
import IUnitState from "../../Interfaces/IUnitState";
import SmallShockNova from "../../Objects/Effects/SmallShockNova";
import { Lightning } from "../../Objects/Projectiles/Lightning";

import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import Ability from "../Ability";
import FlyerAbility from "./FlyerAbility";

export default class LightBeacon extends FlyerAbility implements IUnitState<Flyer>{

    state: number
    up_timer: any
    beacon_timer:any
    lightning_waves: boolean
    air_form: boolean
    timer: any

    constructor(owner: Flyer){
        super(owner)
        this.cost = 7
        this.state = 0
        this.up_timer
        this.beacon_timer
        this.name = 'light beacon'
        this.lightning_waves = false
        this.air_form = false
        this.need_to_pay = true
        this.type = Ability.TYPE_CUSTOM
    }

    enter(unit: Flyer): void {
        unit.can_be_controlled_by_player = false

        this.state = 0
        unit.pay_to_cost = this.cost

        unit.is_attacking = true
        unit.state = 'fly up'
        unit.action_time = 800
        unit.setImpactTime(90)

        let cast_speed = unit.getCastSpeed()
        unit.level.addSound('lightning cast', unit.x, unit.y)
        unit.action_time = cast_speed
        unit.can_be_damaged = false
    }

    update(unit: Flyer): void {
        if(this.state === 0){
            if(unit.action){
     
                this.state = 1
                unit.state = 'light beacon'
                unit.z += 2
                unit.light_r += 5
                unit.can_regen_resource = false
                let box = unit.getBoxElipse()
                box.r = 17 + unit.getAdditionalRadius()

                if(this.lightning_waves){
                    let timer_freq = 600 - (unit.getAdditionalRadius() * 50)

                    if(timer_freq < 150){
                        timer_freq = 150
                    }

                    this.timer = setInterval(() => {
                        let e = new SmallShockNova(unit.level)
                        e.setPoint(unit.x, unit.y)
    
                        unit.level.effects.push(e)

                        unit.level.enemies.forEach((elem) => {
                        if(Func.elipseCollision(elem.getBoxElipse(), box)){
                            elem.takeDamage()
                        }
                    })
                    }, timer_freq)
                }
                else{
                    let timer_freq = 150 - (unit.getAdditionalRadius() * 10)

                    if(timer_freq < 30){
                        timer_freq = 30
                    }

                    this.timer = setInterval(() => {
                        let e = new Lightning(unit.level)
                        e.setOwner(unit)
                        e.setAngle(Math.random() * 6.28)
                        e.setPoint(unit.x, unit.y)
    
                        unit.level.projectiles.push(e)
                    }, timer_freq)
                }

                setTimeout(() => {
                    this.state = 2
                    unit.state = 'fly down'
                    unit.action_time = 800
                    unit.setImpactTime(100)
                    clearInterval(this.timer)
                }, 6000)
            }
            else{
                unit.z += 0.1
            }
        }
        else if(this.state === 1){
            
        }
        else if(this.state === 2){
            unit.z -= 0.1
            if(unit.action){                 
                this.state = 0
                unit.z = 0
                this.afterUse()
                unit.getState()
            }
        }
    }

    exit(unit: Flyer): void {

        unit.can_be_controlled_by_player = true

        unit.can_regen_resource = true
        unit.z = 0
        unit.light_r -= 5
        clearInterval(this.timer)
        if(this.air_form){
            setTimeout(() => {
                unit.can_be_damaged = true
            }, 3000)
        }
        else{
            unit.can_be_damaged = true
        }
    }

    use(){
        this.owner.setState(this)    
    }
}