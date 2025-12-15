import Func from '../../Func'
import Level from '../../Level'
import { BloodShard } from '../Projectiles/BloodShard'
import Effect from './Effects'

export default class CallOfPower extends Effect {

    last_time: number = 0
    start: number = Date.now()
    count: number = 0

    constructor(
        level: Level,
    ) {
        super(level)
        this.box_r = 4
        this.z = 8
    }

    act(time: number) {
        if(this.count >= 10){
            this.active()
            return
        }
        else if (time - this.start >= 12000) {
            this.delete()
            return
        }
        else if( time - this.last_time >= 500){
            this.last_time = time

            this.level.players.forEach(elem => {
                if (
                    Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())
                ) {
                   if(elem.resource > 0){
                    elem.resource --
                      this.count ++
                   }
                 
                   
                }
            })
        }
    }
}