import Func from '../../Func'
import Level from '../../Level'
import Bleed from '../../Status/Bleed'
import Crushed from '../../Status/Crashed'
import EarthSpikesRingBig from './EarthSpikesRingBig'
import EarthSpikesRingSmall from './EarthSpikesRingSmall'
import Effect from './Effects'
import SingleEarthSpike from './SingleEarthSpike'

export default class EarthSpikesEffect extends Effect {
    
    time: number
    was_first_ring: boolean = false
    constructor(level: Level) {
        super(level)
        this.name = ''
        this.box_r = 0
        this.time = Date.now()
        this.invisible = true
    }

    act(time: number) {
        if (time - this.time >= 2000) {
            let count = 20
            let zones = 6.28 / count
            
            for (let i = 1; i <= count; i++) {
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let a = Math.random() * (max_a - min_a) + min_a
    
                let l = 1 - Math.abs(0.5 * Math.cos(a))
    
                let n_x = Math.sin(a) * l * Func.random(19, 22)
                let n_y = Math.cos(a) * l * Func.random(19, 22)
    
                let spike = new SingleEarthSpike(this.level)
    
                spike.setPoint(this.x + n_x, this.y + n_y)

                this.level.players.forEach(elem => {
                    if(Func.elipseCollision(elem.getBoxElipse(), spike.getBoxElipse())){
                         elem.takeDamage(this.owner, {})
                        if(Func.chance(15)){
                            if(Func.chance(50)){
                                let s = new Crushed(this.level.time)
                                s.setDuration(3000)
                                this.level.setStatus(elem, s, true) 
                            }
                            else{
                                let s = new Bleed(this.level.time)
                                s.setDuration(3000)
                                this.level.setStatus(elem, s, true)
                            }
                        }
                    }
                })
 
                this.level.effects.push(spike)
            }

            this.delete()
            return
        }
        else if(!this.was_first_ring){
            this.was_first_ring = true

            let count = 10
            let zones = 6.28 / count
            
            for (let i = 1; i <= count; i++) {
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let a = Math.random() * (max_a - min_a) + min_a
    
                let l = 1 - Math.abs(0.5 * Math.cos(a))
    
                let n_x = Math.sin(a) * l * Func.random(8, 11)
                let n_y = Math.cos(a) * l * Func.random(8, 11)
    
                let spike = new SingleEarthSpike(this.level)
    
                spike.setPoint(this.x + n_x, this.y + n_y)

                this.level.players.forEach(elem => {
                    if(Func.elipseCollision(elem.getBoxElipse(), spike.getBoxElipse())){
                         elem.takeDamage(this.owner, {})
                        if(Func.chance(15)){
                            if(Func.chance(50)){
                                let s = new Crushed(this.level.time)
                                s.setDuration(3000)
                                this.level.setStatus(elem, s, true) 
                            }
                            else{
                                let s = new Bleed(this.level.time)
                                s.setDuration(3000)
                                this.level.setStatus(elem, s, true)
                            }
                        }
                    }
                })
 
                this.level.effects.push(spike)
            }
        }   
    }
}