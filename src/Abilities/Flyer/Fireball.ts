import Func from "../../Func";
import { FireballProjectile } from "../../Objects/Projectiles/FireballProjectile";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Fireball extends FlyerAbility {

    body_melting: boolean = false
    ignite: boolean = false
    fire_splitting: boolean = true

    constructor(owner: Flyer){
        super(owner)
        this.cost = 1
        this.name = 'fireball'
    }

    impact(){
        this.owner.level.addSound('fire cast', this.owner.x, this.owner.y)

        let a = undefined                    
        let target = this.owner.getTarget()
        
        if(target){
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }

        a = a ? a : this.owner.attack_angle

        let proj = new FireballProjectile(this.owner.level, this.body_melting)
        proj.ignite = this.ignite
        proj.setOwner(this.owner)
        proj.setAngle(a)
        proj.setPoint(this.owner.x, this.owner.y)

        this.owner.level.projectiles.push(proj)

        if(this.fire_splitting){
        
            let half = this.owner.getSecondResource()
            if(half){
                for(let i = -half; i < half; i++){
                    if(i === 0) continue

                    let angle = a + (i * 0.45)

                    let proj = new FireballProjectile(this.owner.level, this.body_melting)
                    proj.ignite = this.ignite
                    proj.setOwner(this.owner)
                    proj.setAngle(angle)
                    proj.setPoint(this.owner.x, this.owner.y)

                    this.owner.level.projectiles.push(proj)
                }
            }
        }
    }
}