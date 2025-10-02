import Func from "../../Func";
import { WeaponFragment } from "../../Objects/Projectiles/WeaponFragment";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import Ability from "../Ability";
import SwordmanAbility from "./SwordmanAbility";

export default class ShatteredWeapon extends SwordmanAbility{

    constructor(owner: Swordman){
        super(owner)
        this.name = 'shattered weapon'
        this.cost = 4
        this.cd = 5000
        this.type = Ability.TYPE_ATTACK
    }

    impact(){
        let second = this.owner.getSecondResource()
    
        let a = undefined                    
        let target = this.owner.getTarget()
        
        if(target){
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }
        a = a ? a : this.owner.attack_angle

        let count = 3 + second
        let zone_per_tooth = 0.6
        
        a -= (Math.round(count / 2) * zone_per_tooth)

        a = a ? a : this.owner.attack_angle
       
        for (let i = 1; i <= count; i++){
            let min_a = a + ((i - 1) * zone_per_tooth)
            let max_a = a + (i * zone_per_tooth)

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new WeaponFragment(this.owner.level)
            proj.setAngle(angle)
            proj.setPoint(this.owner.x, this.owner.y)
            proj.setOwner(this.owner)

            this.owner.level.projectiles.push(proj)
        }
    }
}