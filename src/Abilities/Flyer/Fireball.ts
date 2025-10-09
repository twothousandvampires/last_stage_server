import Func from "../../Func";
import { FireballProjectile } from "../../Objects/Projectiles/FireballProjectile";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Fireball extends FlyerAbility {

    body_melting: boolean
    ignite: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cost = 1
        this.name = 'fireball'
        this.body_melting = false
        this.ignite = false
    }

    impact(){
        this.owner.level.addSound('fire cast', this.owner.x, this.owner.y)

        let a = undefined                    
        let target = this.owner.getTarget()
        
        if(target){
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }

        let proj = new FireballProjectile(this.owner.level, this.body_melting)
        proj.ignite = this.ignite
        proj.setOwner(this.owner)
        proj.setAngle(a ? a : this.owner.attack_angle)
        proj.setPoint(this.owner.x, this.owner.y)

        this.owner.level.projectiles.push(proj)
    }
}