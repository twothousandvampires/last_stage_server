import Func from "../../Func";
import Blood from "../../Objects/Effects/Blood";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import Ability from "../Ability";
import CultistAbility from "./CultistAbility";

export default class SelfFlagellation extends CultistAbility {
    
    pack: boolean = false
    lesson: boolean = false
    spreading: boolean = false

    constructor(owner: Cultist){
        super(owner)
        this.cd = 6000
        this.name = 'self-flagellation'
        this.type = Ability.TYPE_INSTANT
    }

    impact(): void {
        this.used = true

        let e = new Blood(this.owner.level)
        e.setPoint(Func.random(this.owner.x - 2, this.owner.x + 2), this.owner.y)
        e.z = Func.random(2, 8)
        this.owner.level.effects.push(e)

        if(this.pack){
            this.owner.can_be_lethaled = false
        }

        this.owner.chance_to_avoid_damage_state += 100
        this.owner.takeDamage()
        this.owner.chance_to_avoid_damage_state -= 100

        if(this.pack){
            this.owner.can_be_lethaled = true
        }

        if(this.lesson){
            this.owner.move_speed_penalty += 25
            setTimeout(() => {
                this.owner.move_speed_penalty -= 25
            }, 7000)
        }

        if(this.spreading){
            this.owner.level.enemies.forEach((elem) => {
                if(Func.distance(elem, this.owner) <= 12){
                    elem.takePureDamage()
                }
            })
        }

        this.afterUse()
    }
}