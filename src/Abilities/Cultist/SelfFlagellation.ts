import Func from "../../Func";
import Blood from "../../Objects/Effects/Blood";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import CultistAbility from "./CultistAbility";

export default class SelfFlagellation extends CultistAbility{

    cd: boolean
    pack: boolean
    lesson: boolean

    constructor(owner: Cultist){
        super(owner)
        this.cd = false
        this.pack = false
        this.lesson = false
        this.name = 'self-flagellation'
    }

    canUse(): boolean {
        return !this.cd
    }

    use(): void {
        if(this.cd) return 
        this.cd = true

        setTimeout(() => {
            this.cd = false
        }, 10000 - this.owner.getSecondResource() * 300)

        let e = new Blood(this.owner.level)
        e.setPoint(Func.random(this.owner.x - 2, this.owner.x + 2), this.owner.y)
        e.z = Func.random(2, 8)
        this.owner.level.effects.push(e)

        if(this.pack){
            this.owner.can_be_lethaled = false
        }

        this.owner.avoid_damaged_state_chance += 100
        this.owner.takeDamage()
        this.owner.avoid_damaged_state_chance -= 100

        if(this.pack){
            this.owner.can_be_lethaled = true
        }

        if(this.lesson){
            this.owner.move_speed += 0.2
            setTimeout(() => {
                this.owner.move_speed -= 0.2
            }, 3000)
        }
    }
}