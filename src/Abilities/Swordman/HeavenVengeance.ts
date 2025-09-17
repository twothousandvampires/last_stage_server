import Func from "../../Func";
import LightningBoltEffect from "../../Objects/Effects/LightningBoltEffect";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import SwordmanAbility from "./SwordmanAbility";

export default class HeavenVengeance extends SwordmanAbility{
  
    public eye: boolean = false
    public grace: boolean = false

    constructor(owner: Swordman){
        super(owner)
        this.name = 'heaven vengeance'
        this.cd = 3300
    }

    canUse(): boolean {
        return this.isEnergyEnough() && !this.used && this.owner.can_attack && !this.owner.is_attacking
    }

    trigger(){
        this.used = false
    }

    impact(){
        this.owner.hit = true
        this.used = true

        let enemies = this.owner.level.enemies
        let players = this.owner.level.players

        let second = this.owner.getSecondResource()

        let attack_elipse = this.owner.getBoxElipse()
        attack_elipse.r = this.owner.attack_radius

        let f = enemies.concat(players).filter(elem => Func.checkAngle(this.owner, elem, this.owner.attack_angle, this.owner.weapon_angle + second / 10))
        let filtered_by_attack_radius = f.filter(elem => Func.elipseCollision(attack_elipse, elem.getBoxElipse()))
        filtered_by_attack_radius.sort((a,b) => Func.distance(a, this.owner) - Func.distance(b, this.owner))

        let target = undefined

        if(this.owner.target){
            target = enemies.find(elem => elem.id === this.owner.target)
            
            if(!target){
                target = players.find(elem => elem.id === this.owner.target)
            }

            if(target){
                if(!Func.checkAngle(this.owner, target, this.owner.attack_angle, 3.14)){
                    target = undefined
                }
                if(!target || !Func.elipseCollision(attack_elipse, target.getBoxElipse())){
                    target = undefined
                }
            }
        }

        let point_added = false
        let target_to_hit = undefined

        if(target){
            target_to_hit = target
        }
        else{
            target_to_hit = filtered_by_attack_radius[0]
        }
            
        this.owner.target = undefined

        if(target_to_hit != undefined){
            target_to_hit.takeDamage(this.owner)
            this.owner.addResourse()
            point_added = true
        }

        let vengeance_count = this.owner.getTargetsCount()

        if(target_to_hit && vengeance_count != 0){
            let vengeance_radius = 18

            if(this.eye){
                vengeance_radius += second * 2
            }

            let hit = this.owner.getBoxElipse()
            hit.r = vengeance_radius

            let vengeance_enemies = this.owner.level.enemies.filter(elem => elem != target_to_hit && !elem.is_dead && Func.elipseCollision(hit, elem.getBoxElipse()))
            let vengeance_players = this.owner.level.players.filter(elem => elem != target_to_hit && elem != this.owner && !elem.is_dead && Func.elipseCollision(hit, elem.getBoxElipse()))
            let vengeance_targets = vengeance_enemies.concat(vengeance_players)

            let sound = false

            for(let i = 0; i < vengeance_count; i++){
                let target = vengeance_targets[i]
                if(!target) break

                target.takeDamage(undefined, {
                    burn: true
                })

                if(!sound){
                    this.owner.level.addSound('lightning bolt', this.owner.x, this.owner.y)
                    sound = true
                }

                let effect = new LightningBoltEffect(this.owner.level)
                effect.setPoint(target.x, target.y)

                this.owner.level.effects.push(effect)
                }
            }
            
            if(!point_added){
                this.owner.level.sounds.push({
                    name: 'sword swing',
                    x: this.owner.x,
                    y: this.owner.y
                })
            }
    }

    use(){
        if(this.used || this.owner.is_attacking) return

        let rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40)
        let rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40)

        if(rel_x < this.owner.x){
            this.owner.flipped = true
        }
        else{
            this.owner.flipped = false    
        } 
      
        if(!this.owner.attack_angle){
            this.owner.attack_angle = Func.angle(this.owner.x, this.owner.y, rel_x, rel_y)
        }
        
        this.owner.using_ability = this
        this.owner.is_attacking = true
        this.owner.state = 'attack'
        let attack_move_speed_penalty = this.owner.getAttackMoveSpeedPenalty()
        this.owner.addMoveSpeedPenalty(-attack_move_speed_penalty)

        this.owner.stateAct = this.act
        let attack_speed = this.owner.getAttackSpeed()

        this.owner.action_time = attack_speed
        this.owner.setImpactTime(80)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(attack_move_speed_penalty)
            this.afterUse()
            this.owner.hit = false
            this.owner.is_attacking = false
        }
    }

    act(){
        if(this.action && !this.hit){
            this.using_ability.impact()
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}