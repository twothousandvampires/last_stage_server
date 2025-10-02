import Func from "../../Func";
import { FrostSphereProjectile } from "../../Objects/Projectiles/FrostSphereProjectile";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class FrostSphere extends FlyerAbility{

    cost: number
    frost_rich: boolean
    reign_of_frost: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cost = 1
        this.name = 'frost sphere'
        this.frost_rich = false
        this.reign_of_frost = false
    }

    impact(){
        this.owner.level.addSound('cold cast', this.owner.x, this.owner.y)
        let a = undefined
        
        let target = this.owner.getTarget()
        if(target){
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }
        
        this.owner.target = undefined

        let proj = new FrostSphereProjectile(this.owner.level)
        proj.frost_rich = this.frost_rich
        proj.reign_of_frost = this.reign_of_frost
        proj.setOwner(this.owner)
        proj.setAngle(a ? a : this.owner.attack_angle)
        proj.setPoint(this.owner.x, this.owner.y)

        this.owner.level.projectiles.push(proj)
    }
}