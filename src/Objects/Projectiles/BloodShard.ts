
import Func from "../../Func";
import Level from "../../Level";
import Projectiles from "./Projectiles";

export class BloodShard extends Projectiles{
    w: number

    constructor(level: Level){
        super(level)
        this.box_r = 0.8
        this.name = 'blood shard'
        this.move_speed = 0.4
        this.w = 2
    }

    act(): void { 

        if(this.isOutOfMap()){
            this.impact()
            return
        }

        for(let i = 0; i < this.level.players.length; i++){
            let p = this.level.players[i]

            if(!p.is_dead && p.z < this.w && Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())){
                p.addLife()
                this.impact()
                return
            }
        }

        for(let i = 0; i < this.level.enemies.length; i++){
            let e = this.level.enemies[i]

            if(!e.is_dead && Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse())){
                e.takeDamage()
                this.impact()
                return
            }
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
        this.level.deleted.push(this.id)
        this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
    }
}