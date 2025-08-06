import Func from "../../Func";
import SmallShockNova from "../../Objects/Effects/SmallShockNova";
import { Lightning } from "../../Objects/Projectiles/Lightning";
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
    }

    canUse(){
        return this.owner.resource >= this.cost
    }

    use(){
        if(this.owner.is_attacking) return
        
        this.owner.can_move_by_player = false

        this.state = 0
        this.owner.pay_to_cost = this.cost

        this.owner.is_attacking = true
        this.owner.state = 'fly up'
        this.owner.action_time = 800
        this.owner.stateAct = this.act()
        let cast_speed = this.owner.getCastSpeed()
        this.owner.level.addSound('lightning cast', this.owner.x, this.owner.y)
        this.owner.action_time = cast_speed

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.can_move_by_player = true
            this.owner.hit = false
            this.owner.is_attacking = false
            this.owner.z = 0
            this.owner.light_r -= 5
            if(this.air_form){
                setTimeout(() => {
                    this.owner.can_be_damaged = true
                }, 3000)
            }
            else{
                this.owner.can_be_damaged = true
            }
        }
    }

    act(){
        let ability = this
        let timer: any = undefined
        let owner = this.owner
        return () => {
            if(ability.state === 0){
                if(owner.action){
                    owner.can_be_damaged = false
                    owner.payCost()
                    owner.action = false
                    ability.state = 1
                    owner.state = 'light beacon'
                    owner.z += 2
                    owner.light_r += 5

                    let box = owner.getBoxElipse()
                    box.r = 17

                    if(this.lightning_waves){
                        let timer_freq = 600 - (owner.getAdditionalRadius() * 50)

                        if(timer_freq < 150){
                            timer_freq = 150
                        }

                        timer = setInterval(() => {
                            let e = new SmallShockNova(owner.level)
                            e.setPoint(owner.x, owner.y)
        
                            owner.level.effects.push(e)

                            owner.level.enemies.forEach((elem) => {
                            if(Func.elipseCollision(elem.getBoxElipse(), box)){
                                elem.takeDamage()
                            }
                        })
                        }, timer_freq)

                       
                    }
                    else{
                        let timer_freq = 150 - (owner.getAdditionalRadius() * 10)

                        if(timer_freq < 30){
                            timer_freq = 30
                        }

                        timer = setInterval(() => {
                            let e = new Lightning(owner.level)
                            e.setOwner(owner)
                            e.setAngle(Math.random() * 6.28)
                            e.setPoint(owner.x, owner.y)
        
                            owner.level.projectiles.push(e)
                        }, timer_freq)
                    }

                    

                    setTimeout(() => {
                        ability.state = 2
                        owner.state = 'fly down'
                        owner.action_time = 800
                        clearInterval(timer)
                    }, 6000)
                }
                else{
                    owner.z += 0.1
                }
            }
            else if(ability.state === 1){
                
            }
            else if(ability.state === 2){
                owner.z -= 0.1
                if(owner.action){                 
                    ability.state = 0
                    owner.action = false
                    owner.z = 0
                    owner.getState()
                }
            }
        }
    }
}