import Func from "../../Func";
import IUnitState from "../../Interfaces/IUnitState";
import Character from "../../Objects/src/Character";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import Ability from "../Ability";
import SwordmanAbility from "./SwordmanAbility";

export default class Charge extends SwordmanAbility implements IUnitState<Character> {
   
    cost: number
    distance: number
    point_added: boolean
    hited: any[]
    start: boolean
    end: boolean
    destroyer: boolean
    possibilities: boolean
    end_timeout: any

    constructor(owner: Swordman){
        super(owner)
        this.cost = 4
        this.distance = 2000
        this.point_added = false
        this.hited = []
        this.start = false
        this.end = false
        this.destroyer = false
        this.end_timeout = undefined
        this.possibilities = false
        this.name = 'charge'
        this.cd = 8500
        this.type = Ability.TYPE_CUSTOM
    }

    enter(player: Character){
        player.prepareToAction()
   
        this.used = true

        player.state = 'charge'
        player.action_time = 200
        player.setImpactTime(100)

        player.chance_to_avoid_damage_state += 100
    }

    update(player: Character){
        if(this.end){
            player.getState()
        }
        else if(player.action || this.start){
            this.start = true
            let speed = player.getMoveSpeed()

            let next_step_x = Math.sin(player.attack_angle) * speed * 1.5
            let next_step_y = Math.cos(player.attack_angle) * speed * 1.5

            if(!player.isOutOfMap(player.x + next_step_x, player.y + next_step_y)){
                player.addToPoint(next_step_x, next_step_y)
            }

            let stun_power = 2000

            let count = player.getTargetsCount()
            let second = player.getSecondResource()

            player.level.enemies.forEach((elem) => {
                if(!this.hited.includes(elem.id) && Func.elipseCollision(player.getBoxElipse(), elem.getBoxElipse())){
                    this.hited.push(elem.id)

                    if(count > 0 && this.destroyer && Func.chance(35 + second)){
                        elem.takeDamage(player, {
                            explode: true
                        })
                        count--
                    }
                    
                    if(!elem.is_dead){
                        elem.setStun(stun_power)
                    }
                    
                    player.addPoint()
                }
            })

            player.level.players.forEach((elem) => {
                if(elem != player && !this.hited.includes(elem.id) && Func.elipseCollision(player.getBoxElipse(), elem.getBoxElipse())){
                    this.hited.push(elem.id)
                    elem.setStun(stun_power)
                    player.addPoint()
                }
            })
        }
    }

    exit(player: Character){
        clearTimeout(this.end_timeout)
        this.afterUse()
        this.start = false
        this.end = false
        
        if(this.possibilities && this.hited.length >= 3){
            player.addResourse()
        }

        player.is_attacking = false
        player.action = false
     
        player.succefullCast()
        player.attack_angle = undefined
        player.chance_to_avoid_damage_state -= 100
        
        this.hited = []
    }

    use(){
        this.owner.using_ability = this
        this.owner.pay_to_cost = this.cost
        this.owner.setState(this)
       
        this.end_timeout = setTimeout(() => {
            this.end = true
        }, this.distance)
    }
}