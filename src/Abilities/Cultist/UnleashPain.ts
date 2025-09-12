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
    }

    canUse(): boolean {
        return this.owner.resource >= this.cost && this.owner.can_attack && !this.owner.is_attacking
    }

    use(){
        this.owner.pay_to_cost = this.cost

        this.owner.is_attacking = true
        this.owner.state = 'attack'
        let move_speed_reduce = this.owner.getMoveSpeedReduceWhenUseSkill()
        this.owner.addMoveSpeedPenalty(-move_speed_reduce)
     
        this.owner.stateAct = this.act
        let attack_speed = this.owner.getAttackSpeed()

        this.owner.action_time = attack_speed

        this.owner.cancelAct = () => {
            this.owner.action = false
    
            this.owner.hit = false
            this.owner.is_attacking = false
            this.owner.addMoveSpeedPenalty(move_speed_reduce)
        }
    }

    act(){
        if(this.action && !this.hit){
            this.hit = true
            
             this.level.addSound({
                    name:'cast',
                    x: this.x,
                    y: this.y
            })

            let e = this.getBoxElipse()

            e.r = 18 + this.getSecondResource()

            let enemy = this.level.enemies.filter((elem) => {
                return Func.elipseCollision(elem.getBoxElipse(), e)
            })

            let count = 7

            if(this.third_ability.reign_of_pain){
                count += this.getSecondResource() * 3
            }

            let enemyw = enemy.slice(0, 30)
         
            enemyw.forEach((elem) => {
                let ghost = new WalkingGhostCultist(this.level)
                ghost.target = elem
                ghost.restless = this.third_ability.restless_warriors
                ghost.setPoint(this.x, this.y)

                this.level.binded_effects.push(ghost)
            })

            this.payCost()
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}