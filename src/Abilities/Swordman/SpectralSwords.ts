import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import SpectralSword from "../../Objects/src/Summons/SpectralSword";
import SwordmanAbility from "./SwordmanAbility";

export default class SpectralSwords extends SwordmanAbility{

    constructor(owner: Swordman){
        super(owner)
        this.name = 'spectral swords'
        this.cost = 8
    }

    canUse(): boolean {
        return this.owner.resource >= this.cost && !this.owner.is_attacking
    }

    use(){
        if(this.owner.is_attacking) return

        this.owner.is_attacking = true
        this.owner.state = 'cast'

        this.owner.pay_to_cost = this.cost

        let attack_move_speed_penalty = this.owner.getAttackMoveSpeedPenalty()
        this.owner.addMoveSpeedPenalty(-attack_move_speed_penalty)

        this.owner.stateAct = this.act
        let attack_speed = this.owner.cast_speed

        this.owner.action_time = attack_speed
        this.owner.setImpactTime(80)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(attack_move_speed_penalty)
            this.owner.hit = false
            this.owner.is_attacking = false
        }
    }

    act(){
        if(this.action && !this.hit){
            this.level.sounds.push({
                name: 'holy cast',
                x: this.x,
                y: this.y
            })

            this.payCost()

            this.hit = true
        
            let count = 5
            let zones = 6.28 / count
    
            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let l = 1 - Math.abs(0.5 * Math.cos(angle))

                let n_x = Math.sin(angle) * l * 5
                let n_y = Math.cos(angle) * l * 5

                let summon = new SpectralSword(this.level, 15000 + this.getSecondResource() * 1000, this)
                summon.setPoint(this.x + n_x, this.y + n_y)
                
                this.level.enemies.push(summon)
            }
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}