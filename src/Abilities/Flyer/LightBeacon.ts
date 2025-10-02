import Func from "../../Func";
import SmallShockNova from "../../Objects/Effects/SmallShockNova";
import { Lightning } from "../../Objects/Projectiles/Lightning";
import Character from "../../Objects/src/Character";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class LightBeacon extends FlyerAbility{

    state: number
    cost: number
    up_timer: any
    beacon_timer:any
    lightning_waves: boolean
    air_form: boolean

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
    }

    use(){
        this.owner.setState(this.act)    
    }

    act(){
        if(!(this instanceof Character)) return
        let ability = this.third_ability
        if(!(ability instanceof LightBeacon)) return

        this.can_be_controlled_by_player = false

        ability.state = 0
        this.pay_to_cost = ability.cost

        this.is_attacking = true
        this.state = 'fly up'
        this.action_time = 800
        this.setImpactTime(90)

        let cast_speed = this.getCastSpeed()
        this.level.addSound('lightning cast', this.x, this.y)
        this.action_time = cast_speed
        this.can_be_damaged = false

        this.cancelAct = () => {
            this.action = false
            this.can_be_controlled_by_player = true
            this.hit = false
            this.is_attacking = false
            this.can_regen_resource = true
            this.z = 0
            this.light_r -= 5

            if(ability.air_form){
                setTimeout(() => {
                    this.can_be_damaged = true
                }, 3000)
            }
            else{
                this.can_be_damaged = true
            }
        }
       
        this.stateAct = (tick: number) => {
            let timer = undefined
            if(ability.state === 0){
                if(this.action){
                    this.payCost()
                    this.action = false
                    ability.state = 1
                    this.state = 'light beacon'
                    this.z += 2
                    this.light_r += 5
                    this.can_regen_resource = false
                    let box = this.getBoxElipse()
                    box.r = 17 + this.getAdditionalRadius()

                    if(this.lightning_waves){
                        let timer_freq = 600 - (this.getAdditionalRadius() * 50)

                        if(timer_freq < 150){
                            timer_freq = 150
                        }

                        timer = setInterval(() => {
                            let e = new SmallShockNova(this.level)
                            e.setPoint(this.x, this.y)
        
                            this.level.effects.push(e)

                            this.level.enemies.forEach((elem) => {
                            if(Func.elipseCollision(elem.getBoxElipse(), box)){
                                elem.takeDamage()
                            }
                        })
                        }, timer_freq)
                    }
                    else{
                        let timer_freq = 150 - (this.getAdditionalRadius() * 10)

                        if(timer_freq < 30){
                            timer_freq = 30
                        }

                        timer = setInterval(() => {
                            let e = new Lightning(this.level)
                            e.setOwner(this)
                            e.setAngle(Math.random() * 6.28)
                            e.setPoint(this.x, this.y)
        
                            this.level.projectiles.push(e)
                        }, timer_freq)
                    }

                    setTimeout(() => {
                        ability.state = 2
                        this.state = 'fly down'
                        this.action_time = 800
                        this.setImpactTime(100)
                        clearInterval(timer)
                    }, 6000)
                }
                else{
                    this.z += 0.1
                }
            }
            else if(ability.state === 1){
                
            }
            else if(ability.state === 2){
                this.z -= 0.1
                if(this.action){                 
                    ability.state = 0
                    this.action = false
                    this.z = 0
                    ability.afterUse()
                    this.getState()
                }
            }
        }
    }
}