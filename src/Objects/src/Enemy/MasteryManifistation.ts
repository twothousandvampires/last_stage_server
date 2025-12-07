import Builder from '../../../Classes/Builder'
import Func from '../../../Func'
import Level from '../../../Level'
import Manifistation from './Manifistation'

export class MasteryManifistation extends Manifistation {
    constructor(level: Level) {
        super(level)
        this.name = 'mastery manifistation'
        this.count_to_activate = 8
    }

    activate(): void {}

    async giveReward() {
        if (this.stage === 0) return
        if (!this.activated_by) return

        if (this.stage >= 1) {
            this.activated_by.attack_speed -= 20
            this.activated_by.cast_speed -= 20
            this.activated_by.level.addMessedge('attack and cast speed was increased')
        }
        if (this.stage >= 2) {
            this.activated_by.armour += 3
            await Func.sleep(2000)
            this.activated_by.level.addMessedge('armour was increased')
        }
        if (this.stage >= 3) {
            this.activated_by.pierce += 3
            await Func.sleep(2000)
            this.activated_by.level.addMessedge('pierce was increased')
        }
        if (this.stage >= 4) {
            this.activated_by.move_speed_penalty += 5
            await Func.sleep(2000)
            this.activated_by.level.addMessedge('speed was increased')
        }
        if (this.stage >= 5) {
            let mastery = Builder.createRandomMastery()
            this.activated_by.masteries.push(mastery)
            await Func.sleep(2000)
            this.activated_by.level.addMessedge(mastery.name + ' was added')
        }
    }
}
