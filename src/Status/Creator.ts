import Func from '../Func'
import ChargedSphere from '../Objects/Effects/ChargedSphere'
import Effect from '../Objects/Effects/Effects'
import GraceShard from '../Objects/Effects/GraceShard'
import Helm from '../Objects/Effects/Helm'
import ItemDrop from '../Objects/Effects/ItemDrop'
import SorcerersSkull from '../Objects/Effects/SorcerersSkull'
import Split from '../Objects/Effects/Split'
import Status from './Status'

export default class Creator extends Status {
    
    frequency: number = 5000
    last_checked: number

    constructor(
        public time: number,
    ) {
        super(time)
        this.last_checked = time
    }

    apply(unit: any) {
        this.unit = unit

        this.unit.newStatus({
            name: 'creator',
            duration: this.duration,
            desc: 'creator',
        })
    }

    clear() {}

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'creator',
            duration: this.duration,
            desc: 'creator',
        })
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            if (!this.unit) return
            this.last_checked += this.frequency
            if (Func.notChance(10)) return

            let drop_name: Effect | undefined | string = undefined

            let total_weights = [
                ['grace', 20],
                ['energy', 5],
                ['entity', 5],
                ['item', 1],
                ['skull', 1],
                ['helm', 1],
            ]

            let sum = total_weights.reduce((acc, elem) => elem[1] + acc, 0)
            let w2 = 0
            let rnd = Math.random() * sum
            for (let item of total_weights) {
                w2 += item[1]
                if (rnd <= w2) {
                    drop_name = item[0]
                    break
                }
            }

            if (drop_name === 'grace') {
                drop_name = new GraceShard(this.unit.level)
            } else if (drop_name === 'energy') {
                drop_name = new ChargedSphere(this.unit.level)
            } else if (drop_name === 'entity') {
                drop_name = new Split(this.unit.level)
            } else if (drop_name === 'item') {
                drop_name = new ItemDrop(this.unit.level)
            } else if (drop_name === 'skull') {
                drop_name = new SorcerersSkull(this.unit.level)
            } else if (drop_name === 'helm') {
                drop_name = new Helm(this.unit.level)
            }

            if (drop_name instanceof Effect) {
                let a = Math.random() * 6.28
                drop_name.setPoint(this.unit.x + Math.sin(a) * 6, this.unit.y + Math.cos(a) * 6)
                this.unit?.level.binded_effects.push(drop_name)
            }
        }
    }
}
