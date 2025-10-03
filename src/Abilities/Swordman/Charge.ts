import Func from "../../Func";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import Ability from "../Ability";
import SwordmanAbility from "./SwordmanAbility";

export default class Charge extends SwordmanAbility{
   
    cost: number
    distance: number
    point_added: boolean
    start_x: number | undefined
    start_y: number | undefined
    hited: any[]
    start: boolean
    end: boolean
    destroyer: boolean
    possibilities: boolean
    end_timeout: any

    constructor(owner: Swordman){
        super(owner)
        this.cost = 4
        this.distance = 2000
        this.point_added = false
        this.hited = []
        this.start = false
        this.end = false
        this.destroyer = false
        this.end_timeout = undefined
        this.possibilities = false
        this.name = 'charge'
        this.cd = 8500
        this.type = Ability.TYPE_CUSTOM
    }

    use(){
        this.owner.is_attacking = true
      
        this.start_x = this.owner.x
        this.start_y = this.owner.y

        this.used = true

        let rel_x =  this.owner.pressed.canvas_x + this.owner.x - 40
        let rel_y =  this.owner.pressed.canvas_y + this.owner.y - 40

        if(rel_x < this.owner.x){
            this.owner.flipped = true
        }
        else{
            this.owner.flipped = false    
        }

        if(!this.owner.attack_angle){
            this.owner.attack_angle = Func.angle(this.owner.x, this.owner.y, rel_x, rel_y)
        }  
        this.owner.state = 'charge'
        this.owner.action_time = 200
        this.owner.setImpactTime(100)
        
        this.owner.chance_to_avoid_damage_state += 100

        this.end_timeout = setTimeout(() => {
            this.end = true
        }, this.distance)

        this.owner.cancelAct = () => {
            clearTimeout(this.end_timeout)
            this.owner.is_attacking = false
            this.afterUse()
            this.owner.action = false
            this.point_added = false
            this.start_x = undefined
            this.start_y = undefined
            this.start = false
            this.end = false
            this.owner.succefullCast()
            this.owner.attack_angle = undefined
            this.owner.chance_to_avoid_damage_state -= 100
            if(this.possibilities && this.hited.length >= 3){
                this.owner.addResourse()
            }
            this.hited = []
        }

        this.owner.stateAct = this.getAct()
    }

    getAct(){
        let owner = this.owner
        let ability = this
        let second = this.owner.getSecondResource()
        let count = this.owner.getTargetsCount() + second

        return () => {
            if(ability.end){
                owner.getState()
            }
            else if(owner.action || ability.start){
                ability.start = true
                let speed = owner.getMoveSpeed()
    
                let next_step_x = Math.sin(owner.attack_angle) * speed * 1.5
                let next_step_y = Math.cos(owner.attack_angle) * speed * 1.5
    
                if(!owner.isOutOfMap(owner.x + next_step_x, owner.y + next_step_y)){
                    owner.addToPoint(next_step_x, next_step_y)
                }

                let stun_power = 2000

                owner.level.enemies.forEach((elem) => {
                    if(!ability.hited.includes(elem.id) && Func.elipseCollision(owner.getBoxElipse(), elem.getBoxElipse())){
                        ability.hited.push(elem.id)

                        if(count > 0 && ability.destroyer && Func.chance(35 + second)){
                            elem.takeDamage(owner, {
                                explode: true
                            })
                            count--
                        }
                        
                        if(!elem.is_dead){
                            elem.setStun(stun_power)
                        }
                        
                        owner.addPoint()
                    }
                })

                owner.level.players.forEach((elem) => {
                    if(elem != owner && !ability.hited.includes(elem.id) && Func.elipseCollision(owner.getBoxElipse(), elem.getBoxElipse())){
                        ability.hited.push(elem.id)
                        elem.setStun(stun_power)
                        owner.addPoint()
                    }
                })
            }
        }  
    }
}