
import Func from "../../Func";
import Level from "../../Level";
import FireExplosion from "../Effects/FireExplosion";
import Projectiles from "./Projectiles";

export class FlamyFireBall extends Projectiles{
    w: number
    constructor(level: Level){
        super(level)
        this.box_r = 0.5
        this.name = 'flamy_fireball'
        this.move_speed = 0.25
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
        let effect = new FireExplosion(this.level)
        effect.setPoint(this.x, this.y)
        this.level.addSound('fire explosion', this.x, this.y)
        this.level.effects.push(effect)
        this.level.deleted.push(this.id)

        let explosion = this.getBoxElipse()
        explosion.r = 2

        this.level.players.forEach(p => {
            if(p.z < 5 && Func.elipseCollision(explosion, p.getBoxElipse())){
                p.takeDamage()
            }
        })
        
        this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
    }
}