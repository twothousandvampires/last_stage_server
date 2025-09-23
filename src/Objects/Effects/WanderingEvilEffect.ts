import Func from "../../Func";
import Level from "../../Level";
import { Bone } from "../Projectiles/Bone";
import Effect from "./Effects";

export default class WanderingEvilEffect extends Effect {

    target: any
    start: number = Date.now()
    hit_x: number | undefined
    hit_y: number | undefined
    inside: boolean = false
    inside_start: number = 0

    constructor(level: Level, public start_power: number = 0){
        super(level)
        this.name = 'curse of damned'
        this.box_r = 2
        this.move_speed = 0.4
    }

    delete(){
        this.level.deleted.push(this.id)
        this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
    }

    act(time: number){
        if(this.inside){
            if(time - this.inside_start >= 4000){
                if(!this.target.is_dead){
                    let count = 7

                    this.target.armour_rate = 0
                    this.target.life_status = 1
                   
                    this.target.takeDamage(this.owner,{
                        explode: true
                    })

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
                this.inside = false
                this.invisible = false
                this.target = undefined
                this.start += 4000
            }
            else{
                this.x = this.target.x
                this.y = this.target.y
            }
            return
        }

        if(time - this.start >= 12000){
            this.delete()
            return
        }
        
        if(!this.target){
            let b = this.getBoxElipse()
            b.r = 20
            let targets = this.level.enemies.filter(elem => Func.elipseCollision(elem.getBoxElipse(), b))
            this.target = targets[Math.floor(Math.random() * targets.length)]
        }

        if(!this.target) return
        
        let b = this.getBoxElipse()

        if(Func.elipseCollision(this.target.getBoxElipse(), b)){
            this.invisible = true
            this.inside = true
            this.inside_start = this.level.time
        }
        else{
            let angle = Func.angle(this.x, this.y, this.target.x, this.target.y)

            let l = 1 - Math.abs(0.5 * Math.cos(angle))    

            let n_x = Math.sin(angle) * l
            let n_y = Math.cos(angle) * l

            n_x *= this.move_speed
            n_y *= this.move_speed

            this.addToPoint(n_x, n_y)
        }
    }
}