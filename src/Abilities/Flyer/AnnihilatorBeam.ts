import Func from "../../Func";
import ToothExplode from "../../Objects/Effects/ToothExplode";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class AnnihilatorBeam extends FlyerAbility{

    concentrating_energy: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cost = 5
        this.name = 'annihilator beam'
        this.concentrating_energy = false
        this.cd = 3000
    }

    impact(){
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
                    elem.takeDamage(this.owner, {
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
}