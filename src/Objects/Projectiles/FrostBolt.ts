import Func from "../../Func";
import Level from "../../Level";
import FrostExplosionSmall from "../Effects/FrostExplosionSmall";
import Projectiles from "./Projectiles";

export class FrostBolt extends Projectiles{
    w: number

    constructor(level: Level){
        super(level)
        this.box_r = 0.3
        this.name = 'frost bolt'
        this.move_speed = 1.6
        this.w = 3
    }

    act(): void { 

        if(this.isOutOfMap()){
            this.impact()
            return
        }

        for(let i = 0; i < this.level.players.length; i++){
            let p = this.level.players[i]

            if(!p.is_dead && p.z < this.w && Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())){

                if(Func.chance(35)){
                    p.setFreeze(1800)
                }
                
                let e = new FrostExplosionSmall(this.level)
                e.setPoint(p.x, p.y)
                this.level.effects.push(e)

                p.takeDamage()
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