import Func from '../../../Func'
import Forging from '../../../Items/Forgings/Forging'
import Level from '../../../Level'
import Default from '../../../Scenarios/Default'
import Manifistation from './Manifistation'

export class ForgeManifistation extends Manifistation {
    constructor(level: Level) {
        super(level)
        this.name = 'forge manifistation'
    }

    activate(): void {
        let enemy_count = 1 + this.stage

        let base_list = ['impy', 'flamy', 'bones', 'slime']

        if (this.stage >= 2) {
            base_list = base_list.concat(['solid', 'magic slime'])
        }

        if (this.stage >= 4) {
            base_list = base_list.concat(['flying bones', 'specter', 'ghost'])
        }

        if (this.level.script instanceof Default) {
            for (let i = 0; i < enemy_count; i++) {
                this.level.script.createRandomEnemy(this.level, base_list)
            }
        }
    }

    giveReward() {
        if (this.stage === 0) return
        if (!this.activated_by) return

        let item = Func.getRandomFromArray(this.activated_by.item)

        if (!item) return

        for (let i = 0; i < this.stage; i++) {
            let forging: Forging = Func.getRandomFromArray(
                item.forge.filter(elem => elem.canBeForged())
            )

            if (!forging) {
                let new_forge = item.getRandomForging()

                while (
                    item.suggested_forgings.some(elem => elem instanceof new_forge.constructor)
                ) {
                    new_forge = item.getRandomForging()
                }

                this.activated_by.gold += new_forge.gold_cost

                new_forge.forge(this.activated_by)

                item.forge.push(new_forge)
            } else {
                this.activated_by.gold += forging.gold_cost

                forging.forge(this.activated_by)
            }
        }

        this.level.addMessedge('was forged: ' + item.name, this.activated_by.id)
    }
}
