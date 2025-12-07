import UpgradeManager from '../../Classes/UpgradeManager'
import Func from '../../Func'
import Level from '../../Level'
import Effect from './Effects'

export default class Forger extends Effect {
    closed: any[] = []

    constructor(level: Level) {
        super(level)
        this.name = 'forger'

        this.box_r = 1.8
        this.zone_id = 1
        this.x = 165
        this.y = 50
    }

    act(time: number) {
        this.level.players.forEach(elem => {
            if (Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())) {
                if (this.closed.includes(elem.id)) {
                    this.closed = this.closed.filter(elem2 => elem2 != elem.id)
                }

                UpgradeManager.showForgings(elem)
            } else if (!this.closed.includes(elem.id)) {
                this.closed.push(elem.id)
                UpgradeManager.closeForgings(elem)
                UpgradeManager.closeSuggest(elem)
            }
        })
    }
}
