import Func from "../../Func";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import SwordmanAbility from "./SwordmanAbility";

export default class Dash extends SwordmanAbility{
   
    distance: number
    point_added: boolean
    start_x: number | undefined
    start_y: number | undefined
    hited: any[]
    start: boolean
    end: boolean
    end_timeout: number = 350
    start_time: number = 0

    constructor(owner: Swordman){
        super(owner)
        this.distance = 450
        this.point_added = false
        this.hited = []
        this.start = false
        this.end = false
        this.name = 'dash'
        this.cd = 3000
    }

    canUse(){
        return !this.used && this.owner.resource >= this.cost && !this.owner.is_attacking
    }

    use(){
        if(this.used || this.owner.is_attacking) return
        
        this.owner.is_attacking = true
      
        this.start_x = this.owner.x
        this.start_y = this.owner.y

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
        this.owner.state = 'dash'
        this.owner.action_time = Math.floor(this.owner.cast_speed / 10)
        this.owner.setImpactTime(100)
        this.owner.level.addSound('holy cast', this.owner.x, this.owner.y)
        
        this.owner.avoid_damaged_state_chance += 100
        this.owner.cancelAct = () => {
            clearTimeout(this.end_timeout)
            this.owner.is_attacking = false
            this.afterUse()
            this.owner.action = false
            this.point_added = false
            this.start_x = undefined
            this.start_y = undefined
            this.end = false
            this.owner.avoid_damaged_state_chance -= 100
            this.start_time = 0
            this.hited = []
        }

        this.owner.stateAct = this.getAct()
    }

    getAct(){
        let owner = this.owner
        let ability = this
        let count = this.owner.getTargetsCount()
        let a_speed = ability.end_timeout
        let bonus = Math.round((1700 - this.owner.getAttackSpeed()) / 2)
        
        if(bonus > 0){
            a_speed += bonus
        }

        return (tick: number) => {
            if(ability.end){
                owner.getState()
                owner.attack_angle = undefined
            }
            else if(owner.action || ability.start_time){
                if(!ability.start_time){
                    ability.used = true
                    ability.start_time = tick
                }
                
                if(tick - ability.start_time >= a_speed){
                    ability.end = true
                    ability.start_time = 0
                    return
                }

                let speed = owner.getMoveSpeed()
    
                let next_step_x = Math.sin(owner.attack_angle) * speed * 1.5
                let next_step_y = Math.cos(owner.attack_angle) * speed * 1.5
    
                if(!owner.isOutOfMap(owner.x + next_step_x, owner.y + next_step_y)){
                    owner.addToPoint(next_step_x, next_step_y)
                }

                let box = owner.getBoxElipse()
                box.r = owner.attack_radius

                owner.level.enemies.forEach((elem) => {
                    if(!ability.hited.includes(elem) && Func.elipseCollision(owner.getBoxElipse(), elem.getBoxElipse())){
                        ability.hited.push(elem)

                        if(count > 0){
                            elem.takeDamage(owner)
                            count--
                        }
                   
                        if(!ability.point_added){
                            ability.point_added = true
                            owner.addResourse()
                        }
                    }
                })

                owner.level.players.forEach((elem) => {
                    if(elem != owner && !ability.hited.includes(elem) && Func.elipseCollision(owner.getBoxElipse(), elem.getBoxElipse())){
                        ability.hited.push(elem)

                        if(!ability.point_added){
                            ability.point_added = true
                            owner.addResourse()
                        }

                        if(count > 0){
                            elem.takeDamage(owner)
                            count--
                        }
                    }
                })
            }
        }  
    }
}