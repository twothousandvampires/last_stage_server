import Func from "../../Func";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import CommandsStatus from "../../Status/CommandsStatus";
import SwordmanAbility from "./SwordmanAbility";

export default class Commands extends SwordmanAbility{

    cast: boolean
    fast_commands: boolean

    constructor(owner: Swordman){
        super(owner)
        this.cd = 20000
        this.cast = false
        this.fast_commands = false
        this.name = 'commands'
    }

    canUse(): boolean {
        return !this.used
    }

    use(): void {
        if(this.used) return

        this.used = true

        this.owner.state = 'cast'
        this.owner.can_move_by_player = false

        this.owner.stateAct = this.getAct()

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.can_move_by_player = true
            this.owner.action_time = undefined
            this.afterUse()
            this.cast = false
        }

        this.owner.action_time = 1500
    
        setTimeout(() => {
            this.cast = true
        }, 1500)
    }

    getAct(){
        let ability = this
        let owner = this.owner
        
        return function(){
            if(ability.cast){
                ability.cast = false
                this.level.sounds.push({
                    name:'holy cast',
                    x: this.x,
                    y: this.y
                })

                let skill_elip = owner.getBoxElipse()
                skill_elip.r = 25

                let second = this.getSecondResource()
                let players = this.level.players.filter(elem => Func.elipseCollision(elem.getBoxElipse(), skill_elip))
                let move_buff = (5 + second) / 100
                let armour_buff = 5 + second
                let duration = 12000
                
                if(ability.fast_commands){
                    move_buff = Math.round(move_buff * 1.5)
                    armour_buff = Math.round(armour_buff * 1.5)
                    duration = 6000
                }

                players.forEach(elem => {
                    let status = new CommandsStatus(elem.time, move_buff, armour_buff) 
                    status.setDuration(duration)
                    
                    owner.level.setStatus(elem, status)
                })
        
                owner.getState()
            }
        }
    }
}