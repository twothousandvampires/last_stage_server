import Func from "../../Func";
import ToothExplode from "../../Objects/Effects/ToothExplode";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class AnnihilatorBeam extends FlyerAbility{

    cost: number
    concentrating_energy: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cost = 5
        this.name = 'annihilator beam'
        this.concentrating_energy = false
        this.cd = 3000
    }

    canUse(){
        return this.owner.resource >= this.cost && !this.used && !this.owner.is_attacking
    }

    impact(){
        this.owner.addCourage()
        this.owner.hit = true
        this.used = true

        this.owner.level.addSound('cast', this.owner.x, this.owner.y)

        let precision = 1.5
        
        let distance = 0
        let enemies = this.owner.level.enemies
        let point = undefined
        
        let n_x = 0
        let n_y = 0

        if(this.concentrating_energy){
            this.owner.pierce += 100
        }
        
        let radius = precision + this.owner.getAdditionalRadius() / 10

        while(!point || !point.isOutOfMap()){

            point = new ToothExplode(this.owner.level)

            n_x =  Math.sin(this.owner.attack_angle) * (precision * distance)
            n_y =  Math.cos(this.owner.attack_angle) * (precision * distance)

            point.setPoint(
                this.owner.x + n_x,
                this.owner.y + n_y
            )

            distance += precision

            let hit = point.getBoxElipse()
            hit.r = radius

            enemies.forEach(elem => {
                if(Func.elipseCollision(hit, elem.getBoxElipse())){
                    elem.takeDamage(this, {
                        burn: true,
                    })
                }
            })

            this.owner.level.effects.push(point)
        }
        
        if(this.concentrating_energy){
            this.owner.pierce -= 100
        }
    }

    use(){
        if(this.used) return

        this.owner.using_ability = this

        let rel_x =  Math.round(this.owner.pressed.canvas_x + this.owner.x - 40)
        let rel_y =   Math.round(this.owner.pressed.canvas_y + this.owner.y - 40)
        
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
        let v =  this.owner.getMoveSpeedPenaltyValue()  
        this.owner.addMoveSpeedPenalty(-v)

        this.owner.stateAct = this.act
        let cast_speed = this.owner.getCastSpeed()

        this.owner.action_time = cast_speed

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(v)
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