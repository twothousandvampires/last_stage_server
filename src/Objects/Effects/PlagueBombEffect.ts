import Func from '../../Func'
import Level from '../../Level'
import Disease from '../../Status/Disease'
import Effect from './Effects'
import PlagueBombExplode from './PlagueBombExplode'

export default class PlagueBombEffect extends Effect {

    start: number

    constructor(level: Level) {
        super(level)
        this.name = 'plague bomb'
        this.box_r = 12
        this.start = Date.now()
    }

    act(game_tick: number) {
        if (game_tick - this.start >= 3000) {
            let e = new PlagueBombExplode(this.level)
            e.setPoint(this.x, this.y)
            this.level.effects.push(e)

            this.level.players.forEach(elem => {
                if(!elem.is_dead && Func.distance(this, elem) <= 10){
                    let s = new Disease(this.level.time)
                    s.setDuration(7000)

                    this.level.setStatus(elem, s, true)
                }
            })
            
            this.delete()
        }
    }
}