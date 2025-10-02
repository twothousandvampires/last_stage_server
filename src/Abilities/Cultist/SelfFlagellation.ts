import Func from "../../Func";
import Blood from "../../Objects/Effects/Blood";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import Ability from "../Ability";
import CultistAbility from "./CultistAbility";

export default class SelfFlagellation extends CultistAbility{
    
    pack: boolean
    lesson: boolean

    constructor(owner: Cultist){
        super(owner)
        this.cd = 6000
        this.pack = false
        this.lesson = false
        this.name = 'self-flagellation'
        this.type = Ability.TYPE_INSTANT
    }

    use(): void {
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
            this.owner.move_speed_penalty += 20
            setTimeout(() => {
                this.owner.move_speed_penalty -= 20
            }, 3000)
        }

        this.afterUse()
    }
}