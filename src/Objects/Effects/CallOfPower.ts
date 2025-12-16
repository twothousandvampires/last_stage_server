import Func from '../../Func'
import Level from '../../Level'
import { InfernoFlame } from '../Projectiles/InfernoFlame'
import Effect from './Effects'
import GoingUpStar from './GoingUpStar'
import LightningBoltEffect from './LightningBoltEffect'
import RocksFromCeil from './RocksFromCeil'
import SmallShockNova from './SmallShockNova'

export default class CallOfPower extends Effect {

    last_time: number = 0
    start: number = Date.now()
    count: number = 0
    effects: any = []

    constructor(
        level: Level,
    ) {
        super(level)
        this.box_r = 4
        this.name = 'call of power'
    }

     delete() {
        this.effects.forEach(elem => {
            this.level.deleted.push(elem)
        })
        this.level.deleted.push(this.id)
        this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
    }

    async activate(){
        let r = Func.random(1, 3)
        if(r === 1){
            let count = 20
        
            let zones = 6.28 / count

            for (let i = 1; i <= count; i++) {
                await Func.sleep(120)
                let min_a = (i - 1) * zones
                let max_a = i * zones

                let a = Math.random() * (max_a - min_a) + min_a

                let l = 1 - Math.abs(0.5 * Math.cos(a))

                let n_x = Math.sin(a) * l * 8
                let n_y = Math.cos(a) * l * 8

            
                let flame = new InfernoFlame(this.level)
                flame.setAngle(a)
                flame.setPoint(this.x + n_x, this.y + n_y)
    
                this.level.projectiles.push(flame) 
            }
        }
        else if(r === 2){
            let enemies = this.level.enemies
            let targets = enemies
    
            for (let i = 0; i < 50; i++) {
                await Func.sleep(150)
    
                let add = Math.round(i / 2)
                let distance_x = Func.random(5, 10) + add
                let distance_y = Func.random(5, 10) + add
                let angle = Math.random() * 6.28
    
                let x = this.x + Math.sin(angle) * distance_x
                let y = this.y + Math.cos(angle) * distance_y
    
                let hiting_box = {
                    x: x,
                    y: y,
                    r: 8,
                }
    
                for (let i = 0; i < targets.length; i++) {
                    let elem = targets[i]
                    if (Func.elipseCollision(hiting_box, elem.getBoxElipse())) {
                        elem.takeDamage(undefined, {
                            burn: true,
                            damage_value: 3
                        })
                        break
                    }
                }
    
                let l_effect = new LightningBoltEffect(this.level)
                l_effect.setPoint(x, y)
    
                this.level.addSound('lightning bolt', x, y)
                this.level.effects.push(l_effect)
    
                setTimeout(() => {
                    let r_effect = new RocksFromCeil(this.level)
                    r_effect.setPoint(x, y)
                    this.level.effects.push(r_effect)
                }, 400)
            }
        }
        else if(r === 3){
            let enemies = this.level.enemies
            let targets = enemies
            let hit = this.getBoxElipse()
            hit.r = 22
    
            targets.forEach(elem => {
                if (!elem.is_dead && Func.elipseCollision(hit, elem.getBoxElipse())) {
                    elem.armour_rate = 0
                    elem.life_status = 1
                    elem.takeDamage(undefined, {
                        explode: true,
                    })
    
                    if (elem.is_dead) {
                        targets.forEach(elem2 => {
                            let hit = elem.getBoxElipse()
                            hit.r = 15
    
                            if (!elem.is_dead && Func.elipseCollision(hit, elem2.getBoxElipse())) {
                                elem2.armour_rate = 0
                                elem2.life_status = 1
                                elem2.takeDamage(undefined, {
                                    explode: true,
                                })
    
                                if (elem2.is_dead) {
                                    targets.forEach(elem3 => {
                                        let hit = elem2.getBoxElipse()
                                        hit.r = 15
    
                                        if (
                                            !elem3.is_dead &&
                                            Func.elipseCollision(hit, elem3.getBoxElipse())
                                        ) {
                                            elem3.armour_rate = 0
                                            elem3.life_status = 1
                                            elem3.takeDamage(undefined, {
                                                explode: true,
                                            })
                                        }
    
                                        let e = new SmallShockNova(this.level)
                                        e.setPoint(elem2.x, elem2.y)
                                        this.level.effects.push(e)
                                    })
    
                                    let e = new SmallShockNova(this.level)
                                    e.setPoint(elem.x, elem.y)
                                    this.level.effects.push(e)
                                }
                            }
                        })
    
                        let e = new SmallShockNova(this.level)
                        e.setPoint(elem.x, elem.y)
                        this.level.effects.push(e)
                    }
                }
            })
    
            let e = new SmallShockNova(this.level)
            e.setPoint(this.x, this.y)
            this.level.effects.push(e)
        }
    }

    act(time: number) {
        if(this.count >= 6){
            this.activate()
            this.delete()
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
                   if(elem.resource > 0){
                    this.level.addSound('call of power', this.x, this.y)
                    let e = new GoingUpStar(this.level)
                    e.setPoint(elem.x, elem.y)
                    this.level.addEffect(e)
                    this.effects.push(e.id)
                    this.start = time
                    elem.resource --
                    this.count ++
                   }                 
                }
            })
        }
    }
}