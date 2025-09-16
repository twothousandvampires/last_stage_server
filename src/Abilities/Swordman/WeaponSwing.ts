import Func from "../../Func";
import TextLanguage1 from "../../Objects/Effects/TextLanguage1";
import TextLanguage2 from "../../Objects/Effects/TextLanguage2";
import TextLanguage3 from "../../Objects/Effects/TextLanguage3";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import ImprovedSwingTechnology from "../../Status/ImprovedSwingTechnology";
import SwordmanAbility from "./SwordmanAbility";

export default class WeaponSwing extends SwordmanAbility{
    echo_swing: boolean
    improved_swing_technology: boolean

    constructor(owner: Swordman){
        super(owner)
        this.echo_swing = false
        this.improved_swing_technology = false
        this.name = 'swing'
    }

    canUse(): boolean {
        return !this.owner.is_attacking && this.owner.can_attack
    }

    use(){
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
        
        this.owner.is_attacking = true
        this.owner.state = 'attack'
        let attack_move_speed_penalty = this.owner.getAttackMoveSpeedPenalty()
        this.owner.addMoveSpeedPenalty(-attack_move_speed_penalty)

        this.owner.stateAct = this.act
        let attack_speed = this.owner.getAttackSpeed()

        this.owner.action_time = attack_speed
        this.owner.setImpactTime(75)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(attack_move_speed_penalty)
            this.owner.hit = false
            this.owner.is_attacking = false 
        }
    }

    act(){
        if(this.action && !this.hit){
            this.hit = true
        
            let enemies = this.level.enemies
            let players = this.level.players

            let second = this.getSecondResource()

            let attack_elipse = this.getBoxElipse()
            attack_elipse.r = this.attack_radius

            let attack_angle = this.attack_angle

            let f = enemies.concat(players).filter(elem => Func.checkAngle(this, elem, this.attack_angle, this.weapon_angle + second / 10))
            let filtered_by_attack_radius = f.filter(elem => Func.elipseCollision(attack_elipse, elem.getBoxElipse()))
            filtered_by_attack_radius.sort((a,b) => Func.distance(a, this) - Func.distance(b, this))

            let target = undefined

            if(this.target){
                target = enemies.find(elem => elem.id === this.target)
                
                if(!target){
                    target = players.find(elem => elem.id === this.target)
                }

                if(target){
                    if(!Func.checkAngle(this, target, this.attack_angle, 3.14)){
                        target = undefined
                    }
                    if(!target || !Func.elipseCollision(attack_elipse, target.getBoxElipse())){
                        target = undefined
                    }
                }
            }

            let hit_count = this.getTargetsCount()

            let point_added = false
            
            if(target){
                filtered_by_attack_radius.unshift(target)
            }
            
            this.target = undefined
            filtered_by_attack_radius = filtered_by_attack_radius.slice(0, hit_count)

            filtered_by_attack_radius.forEach(elem => {
                elem.takeDamage(this)
                if(!point_added){
                    this.level.addSound(elem.getWeaponHitedSound())
                    this.addPoint()
                    point_added = true
                }
            })

            

            if(!point_added){
                this.level.sounds.push({
                    name: 'sword swing',
                    x:this.x,
                    y:this.y
                })
            }
            else{
                if(this.first_ability?.improved_swing_technology && Func.chance(30)){
                    let status = new ImprovedSwingTechnology(this.time)
                    status.setDuration(5000)

                    this.level.setStatus(this, status, true)
                }
            }

            if(this.first_ability?.echo_swing){
                this.first_ability.echo(40, attack_angle, attack_elipse)
            }

            this.attack_angle = undefined
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }

    echo(chance: number = 0, attack_angle: number, attack_elipse: any){
        if(!Func.chance(chance)) return

        setTimeout(() => {
            attack_elipse.r += 1
            let second = this.owner.getSecondResource()

            let f = this.owner.level.enemies.filter(elem => Func.checkAngle(this.owner, elem, attack_angle, this.owner.weapon_angle + second / 10))
            let filtered_by_attack_radius = f.filter(elem => Func.elipseCollision(attack_elipse, elem.getBoxElipse()))
            filtered_by_attack_radius.sort((a,b) => Func.distance(a, this.owner) - Func.distance(b, this.owner))

            filtered_by_attack_radius.forEach(elem => {
                elem.takeDamage(this.owner)
            })

            if(this.improved_swing_technology && Func.chance(30) && filtered_by_attack_radius.length){
                let status = new ImprovedSwingTechnology(this.owner.level.time)
                status.setDuration(5000)
                this.owner.level.setStatus(this.owner, status, true)
            }

            this.owner.level.addSound({
                name: 'sword swing',
                x: attack_elipse.x,
                y: attack_elipse.y
            })

            this.echo(chance / 2, attack_angle, attack_elipse)
        }, 700)
    }
}