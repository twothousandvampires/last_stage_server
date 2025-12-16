import Func from '../../Func'
import Level from '../../Level'
import EternalThirst from '../../Status/EternalThirst'
import Majesty from '../../Status/Majesty'
import TimeDistortion from '../../Status/TimeDistortion'
import { InfernoFlame } from '../Projectiles/InfernoFlame'
import Effect from './Effects'
import GoingUpStar from './GoingUpStar'
import LightningBoltEffect from './LightningBoltEffect'
import RocksFromCeil from './RocksFromCeil'
import SmallShockNova from './SmallShockNova'

export default class CircleOfCalm extends Effect {

    last_time: number = 0
    start: number = Date.now()
    count: number = 0
    effects: any = []

    constructor(
        level: Level,
    ) {
        super(level)
        this.box_r = 4
        this.name = 'circle of calm'
    }

     delete() {
        this.effects.forEach(elem => {
            this.level.deleted.push(elem)
        })
        this.level.deleted.push(this.id)
        this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
    }

    async activate(){
        let r = Func.random(1,3)
        let status = new Majesty(this.level.time)
        if(r === 1){
            status = new EternalThirst(this.level.time)
        }
        else if(r === 2){
            status = new TimeDistortion(this.level.time)
        }
        else if(r === 3){
          
        }
        status.setDuration(16000)
        
        let targets = this.level.players.filter(elem => Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse()))
        let t = Func.getRandomFromArray(targets)
        if(t){
            this.level.setStatus(t, status, true)
        }
        
        this.delete()
    }

    act(time: number) {
        if(this.count >= 6){
            this.activate()
            return
        }
        else if (time - this.start >= 12000) {
            this.delete()
            return
        }
        else if(time - this.last_time >= 500){
            this.last_time = time
            
            this.level.players.forEach(elem => {
                if (
                    Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())
                ) {        
                   if(elem.getSecondResource() > 0){
                    this.level.addSound('call of power', this.x, this.y)
                    let e = new GoingUpStar(this.level)
                    e.setPoint(elem.x, elem.y)
                    this.level.addEffect(e)
                    this.effects.push(e.id)
                    this.start = time

                    elem.reduceSecondResourse()
                    this.count ++
                   }                 
                }
            })
        }
    }
}