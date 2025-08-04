
import Func from "../../Func.js";
import Level from "../../Level.js";
import ToothExplode from "../Effects/ToothExplode.js";
import Projectiles from "./Projectiles.js";

export class Tooth extends Projectiles{
    w: number
    start_x: number | undefined
    start_y: number | undefined
    state: number
    max_distance: number
    medium_distance: number
    min_distance: number

    constructor(level: Level){
        super(level)
        this.box_r = 0.3
        this.name = 'tooth'
        this.move_speed = 0.6
        this.state = 0
        this.w = 3
        this.max_distance = 35
        this.medium_distance = 20
        this.min_distance = 10
    }

    setPoint(x: number = 0, y: number = 0): void{
        this.start_x = x
        this.start_y = y
        this.x = x
        this.y = y
    }

    toJSON(){
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            state: this.state,
            z: this.z,
            flipped: this.flipped,
            name: this.name
        }
    }

    act(): void { 

        if(this.isOutOfMap()){
            this.impact()
            return
        }

        for(let i = 0; i < this.level.enemies.length; i++){
            let e = this.level.enemies[i]

            if(!e.is_dead && e.z < this.w && Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse())){
                e.takeDamage(this.owner)
                this.impact()
                return
            }
        }

        let traveled = Math.sqrt(((this.x - this.start_x) ** 2) + ((this.y - this.start_y) ** 2))

        
        if(traveled >= this.max_distance){
            this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
            this.level.deleted.push(this.id)
            return
        }
        else if(traveled > this.medium_distance && this.state === 1){
            this.state = 2
            this.move_speed = 0.8
        }
        else if(traveled > this.min_distance && this.state === 0){
            this.state = 1
            this.move_speed = 0.7
        }

        let l = 1 - Math.abs(0.5 * Math.cos(this.angle))

        let n_x = Math.sin(this.angle) * l
        let n_y = Math.cos(this.angle) * l

        n_x *= this.move_speed
        n_y *= this.move_speed

        if(n_x < 0){
            this.flipped = true
        }
        else{
            this.flipped = false
        }

        this.addToPoint(n_x, n_y)
    }

    impact(){
        let e = new ToothExplode(this.level)
        e.setPoint(this.x, this.y)
        this.level.effects.push(e)

        this.level.deleted.push(this.id)
        this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
    }
}