import Func from "../../../Func";
import Level from "../../../Level";
import { Bone } from "../../Projectiles/Bone";
import Pile from "./Pile";

export default class PileOfThorns extends Pile{

    collection_of_bones: boolean
    kill_count: number

    constructor(level: Level, public power: number = 0){
        super(level)
        this.frequency = 3000
        this.collection_of_bones = false
        this.kill_count = 0
        this.duration = 12000
        this.cast_time = 1500
        this.getState()
    }

    
    setDyingAct(){
        this.is_dead = true
        this.state = 'dying'
        
        if(this.kill_count > 0){
             let count = this.kill_count
                                    
            let zones = 6.28 / count
    
            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new Bone(this.level)
                proj.setAngle(angle)
                proj.setPoint(this.x, this.y)
    
                this.level.projectiles.push(proj)
            }
        }

        this.stateAct = this.DyingAct
        this.setTimerToGetState(this.dying_time)
    }

    castAct(){
        if(this.action && !this.hit){
            this.hit = true

            this.level.sounds.push({
                    name:'dark cast',
                    x: this.x,
                    y: this.y
            })
            
            let e = this.getBoxElipse()
            e.r = 10 + this.power

            this.level.enemies.forEach(elem => {
                if(elem != this && Func.elipseCollision(elem.getBoxElipse(), e)){
                    elem.takeDamage()
                    if(this.collection_of_bones && elem.is_dead){
                        this.kill_count ++
                    }
                }
            })
        }
    }
}