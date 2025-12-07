import Ability from '../Abilities/Ability'
import Character from '../Objects/src/Character'
import FlyingSwordsStatus from '../Status/FlyingSwordsStatus'
import Mastery from './Mastery'

export default class FlyingSwords extends Mastery {
    constructor() {
        super()
        this.name = 'flying swords'
        this.description =
            'When the ability is activated, there is a chance to summon flying swords.'
    }

    trigger(player: Character, ability: Ability) {
        let s = new FlyingSwordsStatus(player.level.time)
        s.setDuration(10000)

        player.level.setStatus(player, s, true)
    }
}
