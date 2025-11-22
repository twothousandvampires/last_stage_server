import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import CultistAbility from "./CultistAbility";
import WanderingEvilEffect from "../../Objects/Effects/WanderingEvilEffect";

export default class WanderingEvil extends CultistAbility{

    distance: 25

    constructor(owner: Cultist){
        super(owner)
        this.name = 'wandering evil'
        this.distance = 25
        this.cost = 8
        this.need_to_pay = true
        this.mastery_chance = 85
        this.cd = 6000
    }
  
    impact(){
        this.owner.level.sounds.push({
                name:'dark cast',
                x: this.owner.x,
                y: this.owner.y
        })

        let rel_distance = Math.sqrt(((this.owner.x - this.owner.c_x) ** 2) + ((this.owner.y - this.owner.c_y) ** 2))

        let distance = rel_distance > this.distance ? this.distance : rel_distance
        
        let hit_x = this.owner.x + (Math.sin(this.owner.attack_angle) * distance)
        let hit_y = this.owner.y + (Math.cos(this.owner.attack_angle) * distance)

        let second = this.owner.getSecondResource()
        let evil = new WanderingEvilEffect(this.owner.level)
        evil.setOwner(this.owner)
        evil.setPoint(hit_x, hit_y)
        
        this.owner.level.binded_effects.push(evil)

        this.afterUse()
    }
}