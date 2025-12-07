import Ability from '../Abilities/Ability'
import Func from '../Func'
import { SwirlingIceProj } from '../Objects/Projectiles/SwirlingIceProj'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class SwirlingIce extends Mastery {
    constructor() {
        super()
        this.name = 'swirling ice'
        this.description =
            'When the ability is activated, there is a chance to create 3 swirling spheres around you.'
    }

    trigger(player: Character, ability: Ability) {
        let proj1 = new SwirlingIceProj(player.level, Func.random(6, 9))
        proj1.setOwner(player)
        proj1.setAngle(Math.random() * 6.28)

        player.level.projectiles.push(proj1)

        let proj2 = new SwirlingIceProj(player.level, Func.random(14, 18))
        proj2.setOwner(player)
        proj2.setAngle(Math.random() * 6.28)

        player.level.projectiles.push(proj2)

        let proj3 = new SwirlingIceProj(player.level, Func.random(20, 28))
        proj3.setOwner(player)
        proj3.setAngle(Math.random() * 6.28)

        player.level.projectiles.push(proj3)
    }
}
