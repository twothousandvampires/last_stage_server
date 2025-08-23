import Func from "../../Func";
import LightningBoltEffect from "../../Objects/Effects/LightningBoltEffect";
import RocksFromCeil from "../../Objects/Effects/RocksFromCeil";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import ShockStatus from "../../Status/ShockStatus";
import FlyerAbility from "./FlyerAbility";

export default class LightningBolt extends FlyerAbility{

    cost: number
    high_voltage: boolean
    storm: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cost = 1
        this.name = 'lightning bolt'
        this.high_voltage = false
        this.storm = false
    }

    canUse(){
        return this.owner.resource >= this.cost
    }

    use(){
        if(this.owner.is_attacking) return

        let rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40)
        let rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40)
        
        this.owner.c_x = rel_x
        this.owner.c_y = rel_y

        if(rel_x < this.owner.x){
            this.owner.flipped = true
        }
        else{
            this.owner.flipped = false    
        }
        
        if(!this.owner.attack_angle){
            this.owner.attack_angle = Func.angle(this.owner.x, this.owner.y, rel_x, rel_y)
        }

        this.owner.is_attacking = true
        this.owner.state = 'cast'

        let move_speed_reduce = this.owner.getMoveSpeedPenaltyValue()
        this.owner.addMoveSpeedPenalty(-move_speed_reduce)

        this.owner.stateAct = this.act
        let cast_speed = this.owner.getCastSpeed()

        this.owner.action_time = cast_speed

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(move_speed_reduce)

            setTimeout(()=>{
                this.owner.hit = false
                this.owner.is_attacking = false
            },50)
        }
        
        this.owner.setTimerToGetState(cast_speed)
    }

    async act(){
        if(this.action && !this.hit){
            this.addCourage()
            this.hit = true
          
            if(this.target){
                let t = this.level.enemies.find(elem => elem.id === this.target)
                
                if(!t){
                    t = this.level.players.find(elem => elem.id === this.target)
                }

                if(t){
                    this.c_x = Math.floor(t.x)
                    this.c_y = Math.floor(t.y)
                }
            }
           
            let enemies = this.level.enemies
            let players = this.level.players

            let targets = enemies.concat(players)

            let hiting_box = {
                x: this.c_x,
                y: this.c_y,
                r: 4 + Math.round(this.getAdditionalRadius())
            }

            let high_voltage = this.first_ab.high_voltage

            let max_targets = high_voltage ? 3 : 1
            let time = Date.now()

            for(let i = 0; i < targets.length; i++){
                let elem = targets[i]
                if(elem != this && Func.elipseCollision(hiting_box, elem.getBoxElipse())){
                    if(!high_voltage && max_targets === 0){
                        let status = new ShockStatus(time)
                        status.setDuration(5000)
                        status.setPower(20)

                        this.level.setStatus(elem, status)
                    }
                    else if(max_targets > 0){
                        max_targets--
                        elem.takeDamage(this, {
                            burn: true
                        })
                    }
                }
            }

            let l_effect = new LightningBoltEffect(this.level)
            l_effect.setPoint(this.c_x, this.c_y)

            this.level.addSound('lightning bolt', this.c_x, this.c_y)
            this.level.effects.push(l_effect)
            
            this.target = undefined

            setTimeout(() => {
                let r_effect = new RocksFromCeil(this.level)
                r_effect.setPoint(this.c_x, this.c_y)
                r_effect.setOwner(this)
                this.level.effects.push(r_effect)
            }, 400)

            let storm = this.first_ab.storm

            if(storm){
                for(let i = 0; i < 2; i++){
                    await Func.sleep(200)

                    let distance_x = Func.random(5, 10)
                    let distance_y = Func.random(5, 10)
                    let angle = Math.random() * 6.28

                    let x = this.c_x + (Math.sin(angle) * distance_x)
                    let y = this.c_y + (Math.cos(angle) * distance_y)

                    let hiting_box = {
                        x: x,
                        y: y,
                        r: 4 + Math.round(this.getAdditionalRadius())
                    }

                    let max_targets = high_voltage ? 3 : 1

                    for(let i = 0; i < targets.length; i++){
                        let elem = targets[i]
                        if(elem != this && Func.elipseCollision(hiting_box, elem.getBoxElipse())){
                            if(!high_voltage && max_targets === 0){
                                let status = new ShockStatus(time, 5000, 20)
                                status.setDuration(5000)
                                status.setPower(20)
                                
                                this.level.setStatus(elem, status)
                            }
                            else if(max_targets > 0){
                                max_targets--
                                elem.takeDamage(this, {
                                    burn: true
                                })
                            }
                        }   
                    }

                    let l_effect = new LightningBoltEffect(this.level)
                    l_effect.setPoint(x, y)

                    this.level.addSound('lightning bolt', x, y)
                    this.level.effects.push(l_effect)
            
                    setTimeout(() => {
                        let r_effect = new RocksFromCeil(this.level)
                        r_effect.setPoint(x, y)
                        r_effect.setOwner(this)
                        this.level.effects.push(r_effect)
                    }, 400)
                }               
            }
            this.attack_angle = undefined
        }
    }
}