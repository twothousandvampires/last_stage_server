import Func from "../../Func";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import CultistAbility from "./CultistAbility";

export default class Slam extends CultistAbility{

    slaming: boolean
    soul_extraction: boolean

    constructor(owner: Cultist){
        super(owner)
        this.name = 'slam'
        this.slaming = false
        this.soul_extraction = false
    }

    canUse(): boolean {
        return this.isEnergyEnough() &&  this.owner.can_attack && !this.owner.is_attacking
    }

    use(){
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
        this.owner.state = 'attack'
        let move_speed_reduce = this.owner.getMoveSpeedReduceWhenUseSkill()
        this.owner.addMoveSpeedPenalty(-move_speed_reduce)

        this.owner.stateAct = this.act
        let attack_speed = this.owner.getAttackSpeed()

        this.owner.action_time = attack_speed
        this.owner.setImpactTime(85)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(move_speed_reduce)

            this.owner.hit = false
            this.owner.is_attacking = false
            this.owner.hit_x = undefined
        }
    }

    act(){
        if(this.action && !this.hit){

            let second_resource = this.getSecondResource()

            if(this.first_ability.soul_extraction){
                this.additional_chance_grace_create += 10
            }

            this.hit = true
        
            let enemies = this.level.enemies
            let players = this.level.players 

            let rel_distance = Math.sqrt(((this.x - this.c_x) ** 2) + ((this.y - this.c_y) ** 2))

            let total_radius = this.attack_radius + Math.round(second_resource / 2)

            let distance = rel_distance > total_radius ? total_radius : rel_distance

            let hit_x = this.x + (Math.sin(this.attack_angle) * distance)
            let hit_y = this.y + (Math.cos(this.attack_angle) * distance)

            let r = this.getBoxElipse()
            r.r = this.attack_point_radius
            r.x = hit_x
            r.y = hit_y

            if(this.first_ability.slaming){
                r.r += 2
            }

            this.level.addSound({
                name:'blow',
                x: this.x,
                y: this.y
            })

            let f = enemies.filter(elem => Func.elipseCollision(r, elem.getBoxElipse()))
            let p = players.filter(elem => Func.elipseCollision(r, elem.getBoxElipse()) && elem != this)
          
            this.target = undefined
         
            f.concat(p).forEach(elem => {
                elem.takeDamage(this)
            })

            if(this.first_ability.soul_extraction){
                this.additional_chance_grace_create -= 10
            }

            this.attack_angle = undefined
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}