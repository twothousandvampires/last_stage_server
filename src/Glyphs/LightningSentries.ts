import Ability from '../Abilities/Ability'
import { LightningSentry } from '../Objects/Projectiles/LightningSentry'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class LightningSentries extends Mastery {
    constructor() {
        super()
        this.name = 'lightning sentries'
        this.description = 'Creates 3 charged sentries around you for 12 seconds those hit enemies and players.'
    }

    trigger(player: Character, ability: Ability) {
        let proj1 = new LightningSentry(player.level)
        proj1.setOwner(player)
        proj1.setAngle(0)

        player.level.projectiles.push(proj1)

        let proj2 = new LightningSentry(player.level)
        proj2.setOwner(player)
        proj2.setAngle(2.09)

        player.level.projectiles.push(proj2)

        let proj3 = new LightningSentry(player.level)
        proj3.setOwner(player)
        proj3.setAngle(4.18)

        player.level.projectiles.push(proj3)
    }
}