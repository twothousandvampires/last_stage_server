import DespairAbility from '../../../EnemyAbilities/DespairAbility'
import FrostBoltAbility from '../../../EnemyAbilities/FrostBoltAbility'
import Level from '../../../Level'
import EnemyRangeIdleState from '../../../State/EnemyRangeIdleState'
import Undead from './Undead'

export default class Ghost extends Undead {
    spell_name: string | undefined
    retreat_angle: any
    want_to_cast: boolean
    ressurect_chance: number = 35
    can_cast_despair: boolean = true
    can_cast_frost_bolts: boolean = true

    constructor(level: Level) {
        super(level)
        this.name = 'ghost'
        this.box_r = 2.2
        this.move_speed = 0.2
        this.attack_radius = 6
        this.attack_speed = 1600
        this.life_status = 2
        this.spawn_time = 1400
        this.create_grace_chance = 30
        this.create_chance = 80
        this.want_to_cast = true
        this.gold_revard = 4
        this.invisible = true
        this.can_be_burned = false

        this.phasing = true
        this.create_item_chance = 3

        this.abilities = [new DespairAbility(), new FrostBoltAbility()]
    }

    getIdleStateInstance() {
        return new EnemyRangeIdleState()
    }
}
