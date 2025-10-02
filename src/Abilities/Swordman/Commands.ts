import Func from "../../Func";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import CommandsStatus from "../../Status/CommandsStatus";
import SwordmanAbility from "./SwordmanAbility";

export default class Commands extends SwordmanAbility{

    fast_commands: boolean

    constructor(owner: Swordman){
        super(owner)
        this.cd = 16000
        this.fast_commands = false
        this.name = 'commands'
    }

    use(){
        this.owner.using_ability = this
        this.owner.pay_to_cost = this.cost
        this.owner.setState(this.owner.setCastAct)
    }

    impact(){
        this.owner.level.sounds.push({
            name:'holy cast',
            x: this.owner.x,
            y: this.owner.y
        })
        
        this.used = true
        let skill_elip = this.owner.getBoxElipse()
        skill_elip.r = 25

        let second = this.owner.getSecondResource()
        let players = this.owner.level.players.filter(elem => Func.elipseCollision(elem.getBoxElipse(), skill_elip))
        let move_buff = 5 + second
        let armour_buff = 5 + second
        let duration = 12000
        
        if(this.fast_commands){
            move_buff = Math.round(move_buff * 2)
            armour_buff = Math.round(armour_buff * 2)
            duration = 6000
        }

        players.forEach(elem => {
            let status = new CommandsStatus(elem.level.time, move_buff, armour_buff) 
            status.setDuration(duration)
            this.owner.level.setStatus(elem, status)
        })
    }
}