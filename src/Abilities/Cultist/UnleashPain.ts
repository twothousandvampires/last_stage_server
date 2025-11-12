import Func from "../../Func";
import WalkingGhostCultist from "../../Objects/Effects/WalkingGhostCultist";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import CultistAbility from "./CultistAbility";

export default class UnleashPain extends CultistAbility{
    
    reign_of_pain: boolean
    restless_warriors: boolean

    constructor(owner: Cultist){
        super(owner)
        this.name = 'unleash pain'
        this.reign_of_pain = false
        this.restless_warriors = false
        this.cost = 7
        this.need_to_pay = true
    }

    impact(){
        this.owner.level.addSound({
                name:'cast',
                x: this.owner.x,
                y: this.owner.y
        })

        let e = this.owner.getBoxElipse()

        e.r = 18 + (this.reign_of_pain ? 8 : 0)

        let enemy = this.owner.level.enemies.filter((elem) => {
            return Func.elipseCollision(elem.getBoxElipse(), e)
        })

        let count = 7

        if(this.reign_of_pain){
            count += this.owner.getSecondResource() * 3
        }

        let enemyw = enemy.slice(0, 30)
        
        enemyw.forEach((elem) => {
            let ghost = new WalkingGhostCultist(this.owner.level)
            ghost.target = elem
            ghost.restless = this.restless_warriors
            ghost.setPoint(this.owner.x, this.owner.y)

            this.owner.level.binded_effects.push(ghost)
        })

        this.afterUse()
    }
}