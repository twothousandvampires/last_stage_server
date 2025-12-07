import Func from '../../Func'
import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import CommandsStatus from '../../Status/CommandsStatus'
import SwordmanAbility from './SwordmanAbility'

export default class Commands extends SwordmanAbility {
    fast_commands: boolean = false

    constructor(owner: Swordman) {
        super(owner)
        this.cd = 16000
        this.name = 'commands'
        this.mastery_chance = 15
    }

    impact() {
        this.afterUse()

        this.owner.level.sounds.push({
            name: 'holy cast',
            x: this.owner.x,
            y: this.owner.y,
        })

        let skill_elip = this.owner.getBoxElipse()
        skill_elip.r = 25

        let second = this.owner.getSecondResource()
        let players = this.owner.level.players.filter(elem =>
            Func.elipseCollision(elem.getBoxElipse(), skill_elip)
        )
        let move_buff = 5 + second
        let armour_buff = 5 + second
        let duration = 12000

        if (this.fast_commands) {
            move_buff = Math.round(move_buff * 2)
            armour_buff = Math.round(armour_buff * 2)
            duration = 8000
        }

        players.forEach(elem => {
            let status = new CommandsStatus(elem.level.time, move_buff, armour_buff)
            status.setDuration(duration)
            this.owner.level.setStatus(elem, status)
        })
    }
}
