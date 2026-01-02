import Func from '../../Func'
import IUnitState from '../../Interfaces/IUnitState'
import QuakeEffect from '../../Objects/Effects/Quake'
import RocksFromCeil from '../../Objects/Effects/RocksFromCeil'
import QuakeManager from '../../Objects/Managers/QuakeManager'
import Character from '../../Objects/src/Character'
import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import Weakness from '../../Status/Weakness'
import Ability from '../Ability'
import SwordmanAbility from './SwordmanAbility'

export default class Quake extends SwordmanAbility implements IUnitState<Character> {
    fly_time: number = 400
    impact_hit: boolean = false
    consequences: boolean
    selfcare: boolean
    start = 0
    z_add = 0.8
    blasted: boolean = false

    constructor(owner: Swordman) {
        super(owner)
        this.cost = 7
        this.consequences = false
        this.selfcare = false
        this.name = 'quake'
        this.need_to_pay = true
        this.type = Ability.TYPE_CUSTOM
        this.mastery_chance = 75
        this.cd = 6000
    }

    impact(): void {}

    enter(player: Character) {
        player.prepareToAction()
        player.state = 'jump'
  
        player.addMoveSpeedPenalty(-50)

        this.start = player.level.time
        player.can_block = false
    }

    exit(player: Character) {
       
        player.addMoveSpeedPenalty(50)
        this.impact_hit = false
        this.z_add = 0.5

        player.z = 0
        player.can_block = true
    }

    update(player: Character) {
        if (this.impact_hit) {
            let manager = new QuakeManager(this.owner.level, this.owner, this)
            this.owner.level.binded_effects.push(manager)

            this.afterUse()
            player.getState()
        } else {
            let delta = player.level.time - this.start

            if (delta >= this.fly_time * 2) {
                this.impact_hit = true
                return
            }
            let dir = delta >= 400
            if (dir) {
                player.z -= this.z_add
                this.z_add += 0.05
            } else {
                player.z += this.z_add
                this.z_add -= 0.05
            }
        }
    }
}
