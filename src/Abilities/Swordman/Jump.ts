import Func from "../../Func";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import SwordmanAbility from "./SwordmanAbility";

export default class Jump extends SwordmanAbility{
    tick: number
    total_jump_time: number //ms
    direction: boolean
    impact: boolean
    cost: number
    distance: number | undefined
    move_per_tick: number | undefined
    used: boolean
    heavy_landing: boolean
    stomp: boolean

    constructor(owner: Swordman){
        super(owner)
        this.tick = 0
        this.total_jump_time = 1200
        this.direction = false
        this.impact = false
        this.cost = 4
        this.used = false
        this.heavy_landing = false
        this.stomp = false
        this.name = 'jump'
    }

    canUse(){
        return !this.used && this.owner.resource >= this.cost
    }
    
    use(){
        if(this.owner.is_attacking) return
        
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

        this.distance = Math.sqrt(((this.owner.x - rel_x) ** 2) + ((this.owner.y -  rel_y) ** 2))

        if(this.distance > 25) this.distance = 25
        if(this.distance < 10) this.distance = 10

        this.move_per_tick = this.distance / Math.floor(this.total_jump_time / 30)
        
        this.owner.is_attacking = true
        this.owner.state = 'jump'
        this.owner.can_move_by_player = false

        setTimeout(() => {
            this.direction = true
        }, this.total_jump_time/ 2)

        setTimeout(() => {
            this.impact = true
        }, this.total_jump_time)

        this.owner.stateAct = this.getAct()  
        
        this.owner.cancelAct = () => {
            this.used = false
            this.owner.z = 0
            this.owner.is_attacking = false
            this.direction = false
            this.impact = false
            this.owner.can_move_by_player = true
        }
    }

    private getAct(){
        let ability = this
        let owner = this.owner
        let add_z = 0.7
        let point_added = false
      
        return function(){
            if(ability.impact){
                let second = owner.getSecondResource()
                let enemies = owner.level.enemies
    
                let attack_elipse = owner.getBoxElipse()
                attack_elipse.r = owner.attack_radius + (ability.stomp ? 5 : 0) + second
    
                let filtered_by_attack_radius = enemies.filter(elem => Func.elipseCollision(attack_elipse, elem.getBoxElipse()))
                let count = filtered_by_attack_radius.length

                if(filtered_by_attack_radius.length){
                    owner.addPoint()
                    point_added = true
                }

                filtered_by_attack_radius.forEach(elem => {
                    elem.takeDamage(owner)
                })

                filtered_by_attack_radius = owner.level.players.filter(elem => elem != owner && Func.elipseCollision(attack_elipse, elem.getBoxElipse()))
            
                filtered_by_attack_radius.forEach(elem => {
                    elem.takeDamage(owner)
                })

                if(filtered_by_attack_radius.length && !point_added){
                    owner.addPoint()
                }

                if(ability.heavy_landing){
                    owner.armour_rate += count * 4
                    setTimeout(() => {
                        owner.armour_rate -= count * 4
                    },5000)
                }

                owner.getState()
                owner.attack_angle = undefined
                owner.afterUseSecond()
                return
            }
            
            
            owner.z += ability.direction ? -add_z : add_z


            if(ability.direction && add_z < 0.7){
                add_z += 0.02
                if(add_z >= 0.7) add_z = 0.7
            }
            else if(add_z > 0){
                add_z -= 0.02
                if(add_z < 0) add_z = 0
            }

            let next_step_x = Math.sin(owner.attack_angle) * ability.move_per_tick
            let next_step_y = Math.cos(owner.attack_angle) * ability.move_per_tick

            if(!owner.isOutOfMap(owner.x + next_step_x, owner.y + next_step_y)){
                owner.addToPoint(next_step_x, next_step_y)
            }
        }
    }
}