import UpgradeManager from '../../Classes/UpgradeManager'
import Func from '../../Func'
import Level from '../../Level'
import Effect from './Effects'

export default class Teacher extends Effect {
    closed: any[] = []
    ascends: any

    constructor(level: Level) {
        super(level)
        this.name = 'teacher'

        this.box_r = 1.8
        this.zone_id = 1
        this.x = 180
        this.y = 40
    }

    act(time: number) {
        this.level.players.forEach(elem => {
            if (!elem.is_dead && Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())) {
                if (this.closed.includes(elem.id)) {
                    this.closed = this.closed.filter(elem2 => elem2 != elem.id)
                }

                elem.generateUpgrades()
                UpgradeManager.showUpgrades(elem)
            } else if (!this.closed.includes(elem.id)) {
                this.closed.push(elem.id)
                UpgradeManager.closeUpgrades(elem)
            }
        })
    }
}
