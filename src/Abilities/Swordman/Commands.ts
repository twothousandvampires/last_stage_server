import Func from "../../Func";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import CommandsStatus from "../../Status/CommandsStatus";
import SwordmanAbility from "./SwordmanAbility";

export default class Commands extends SwordmanAbility{

    fast_commands: boolean

    constructor(owner: Swordman){
        super(owner)
        this.cd = 20000
        this.fast_commands = false
        this.name = 'commands'
    }

    canUse(): boolean {
        return !this.used
    }

    use(): void {
        if(this.used) return

        this.owner.state = 'cast'

        this.owner.stateAct = this.getAct()
        this.owner.action_time = this.owner.cast_speed
        this.owner.using_ability = this
        this.owner.setImpactTime(80)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.action_time = undefined
            this.afterUse()
        }
    }

    getAct(){
        let ability = this
        let owner = this.owner
        
        return function(){
            if(owner.action){

                owner.level.sounds.push({
                    name:'holy cast',
                    x: owner.x,
                    y: owner.y
                })
                ability.used = true
                let skill_elip = owner.getBoxElipse()
                skill_elip.r = 25

                let second = owner.getSecondResource()
                let players = owner.level.players.filter(elem => Func.elipseCollision(elem.getBoxElipse(), skill_elip))
                let move_buff = 5 + second
                let armour_buff = 5 + second
                let duration = 12000
                
                if(ability.fast_commands){
                    move_buff = Math.round(move_buff * 2)
                    armour_buff = Math.round(armour_buff * 2)
                    duration = 6000
                }

                players.forEach(elem => {
                    let status = new CommandsStatus(elem.time, move_buff, armour_buff) 
                    status.setDuration(duration)
                    owner.level.setStatus(elem, status)
                })

            }
            else if(owner.action_is_end){
                owner.action_is_end = false
                owner.getState()
            }
        }
    }
}