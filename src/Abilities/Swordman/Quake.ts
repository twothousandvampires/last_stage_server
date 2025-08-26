import Func from "../../Func";
import QuakeEffect from "../../Objects/Effects/Quake";
import RocksFromCeil from "../../Objects/Effects/RocksFromCeil";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import Weakness from "../../Status/Weakness";
import SwordmanAbility from "./SwordmanAbility";

export default class Quake extends SwordmanAbility{
    direction: boolean
    impact: boolean
    consequences: boolean
    selfcare: boolean

    constructor(owner: Swordman){
        super(owner)
        this.cost = 7
        this.direction = false
        this.impact = false
        this.consequences = false
        this.selfcare = false
        this.name = 'quake'
    }

    canUse(){
        return this.owner.resource >= this.cost
    }

    afterUse(){
        this.owner.use_not_utility_triggers.forEach(elem => {
                elem.trigger(this.owner)
        })
        this.owner.resource -= this.cost
        this.owner.last_skill_used_time = this.owner.time
    }

    use(){
        if(this.owner.is_attacking) return

        this.owner.is_attacking = true
        this.owner.state = 'jump'
        this.owner.can_move_by_player = false

        this.owner.stateAct = this.getAct()  

        this.owner.avoid_damaged_state_chance += 100
     

        this.owner.cancelAct = () => {
            this.owner.z = 0
            this.owner.is_attacking = false
           
            this.direction = false
            this.impact = false
            this.owner.avoid_damaged_state_chance -= 100
            this.owner.can_move_by_player = true
        }
    }

    getAct(){
        let ability = this
        let owner = this.owner
        let add_z = 0.7

        return function(){
            if(ability.impact){
                let second = owner.getSecondResource()
                let enemies = owner.level.enemies
                let players = owner.level.players

                if(ability.selfcare){
                    players = players.filter(elem => elem != owner)
                }

                let targets = enemies.concat(players)

                let hited: any = []
                let add =  ability.consequences ? 4 : 0
                
                add += second

                let first_wave = owner.getBoxElipse()
                first_wave.r = 5 + add

                let second_wave = owner.getBoxElipse()
                second_wave.r = 8 + add

                let third_wave = owner.getBoxElipse()
                third_wave.r = 11 + add
                
                let to_damage_count = owner.getTargetsCount() * 2

                targets.forEach((elem) => {
                    if(to_damage_count > 0 && Func.elipseCollision(first_wave, elem.getBoxElipse())){
                        hited.push(elem)
                        elem.takeDamage(owner, {
                            explode: true
                        })
                        to_damage_count --
                    }
                })

                targets.forEach((elem) => {
                    if(!hited.includes(elem) && Func.elipseCollision(second_wave, elem.getBoxElipse())){
                        hited.push(elem)
                        elem.setStun(4000)
                    }
                })

                targets.forEach((elem) => {
                    if(!hited.includes(elem) && Func.elipseCollision(third_wave, elem.getBoxElipse())){
                        elem.addMoveSpeedPenalty(-60)
                        setTimeout(() => {
                            elem.addMoveSpeedPenalty(60)
                        }, 5000)
                    }
                })

                let effect = new QuakeEffect(owner.level)
                effect.setPoint(owner.x, owner.y)
        
                owner.level.effects.push(effect)

                owner.getState()

                let effect2 = new RocksFromCeil(this.level)
                effect2.setPoint(owner.x, owner.y)

                owner.level.effects.push(effect2)
                let status = new Weakness(owner.time)
                status.setDuration(ability.consequences ? 6000 : 3000)
                
                owner.level.setStatus(owner, status)

                return
            }
            else{
                owner.z += ability.direction ? -add_z : add_z

                if(ability.direction){
                    add_z += 0.05
                    if(add_z > 0.7){
                        ability.impact = true
                    }
                }
                else{
                    add_z -= 0.05
                    if(add_z < 0){
                        ability.direction = true
                    }
                }
            }
        }
    }
}