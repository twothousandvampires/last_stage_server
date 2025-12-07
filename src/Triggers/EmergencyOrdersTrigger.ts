import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import Character from '../Objects/src/Character'
import CommandsStatus from '../Status/CommandsStatus'

export default class EmergencyOrdersTrigger implements ITrigger {
    chance: number = 35
    name: string = 'emergency orders'
    description: string = 'Gives a chance to grant you and your allies gain Command ability buff'
    cd: number = 1000
    last_trigger_time: number = 0

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character) {
        let box = player.getBoxElipse()
        box.r = player.voice_radius
        player.level.addSound('orders', player.x, player.y)

        player.level.players.forEach(elem => {
            if (Func.elipseCollision(box, elem.getBoxElipse())) {
                let status = new CommandsStatus(player.level.time, 20, 10)
                status.setDuration(3000)

                player.level.setStatus(elem, status, true)
            }
        })
    }
}
