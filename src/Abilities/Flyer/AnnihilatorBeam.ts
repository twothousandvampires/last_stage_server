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
    }

    canUse(){
        return this.owner.resource >= this.cost && !this.used
    }

    use(){
        if(this.owner.is_attacking) return

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

            setTimeout(()=>{
                this.owner.hit = false
                this.owner.is_attacking = false
            },50)
        }
        
        this.owner.setTimerToGetState(cast_speed)
    }

    act(){
        if(this.action && !this.hit){
        
            this.hit = true
            this.action = false
            this.level.addSound('cast', this.x, this.y)

            let precision = 1.5
          
            let distance = 0
            let enemies = this.level.enemies
            let point = undefined
            
            let n_x = 0
            let n_y = 0

            if(this.second_ab.concentrating_energy){
                this.pierce += 100
            }
            
            let radius = precision + this.getAdditionalRadius() / 10

            while(!point || !point.isOutOfMap()){

                point = new ToothExplode(this.level)

                n_x =  Math.sin(this.attack_angle) * (precision * distance)
                n_y =  Math.cos(this.attack_angle) * (precision * distance)

                point.setPoint(
                    this.x + n_x,
                    this.y + n_y
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

                this.level.effects.push(point)
            }
             if(this.second_ab.concentrating_energy){
                this.pierce -= 100
            }
            this.addCourage()
            this.attack_angle = undefined
            this.afterUseSecond()
            // if(true){
            //     let angle = point.isOutOfMap(point.x - n_x, point.y) ? 0 : 90

            //     let normalAngle = angle + Math.PI / 2

            //     let incidenceAngle = this.attack_angle - normalAngle
            
            //     let reflectedAngle = normalAngle - incidenceAngle;

            //     this.attack_angle = (reflectedAngle + 2 * Math.PI) % (2 * Math.PI);

            //     point.setPoint(point.x - n_x, point.y - n_y)

            //     while(!point.isOutOfMap()){

            //         point = new ToothExplode(this.level)

            //         n_x =  Math.sin(this.attack_angle) * (precision * distance)
            //         n_y =  Math.cos(this.attack_angle) * (precision * distance)

            //         point.setPoint(
            //             this.x + n_x,
            //             this.y + n_y
            //         )

            //         distance += precision

            //         let hit = point.getBoxElipse()
            //         hit.r = precision

            //         enemies.forEach(elem => {
            //             if(Func.elipseCollision(hit, elem.getBoxElipse())){
            //                 elem.takeDamage(this, {
            //                     burn: true
            //                 })
            //             }
            //         })

            //         this.level.effects.push(point)
            //     }
            // }
        }
    }
}