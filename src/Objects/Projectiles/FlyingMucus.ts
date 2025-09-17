import Func from "../../Func";
import Level from "../../Level";
import EnvelopingMucus from "../../Status/EnvelopingMucus";
import Projectiles from "./Projectiles";

export class FlyingMucus extends Projectiles{
 
    w: number

    constructor(level: Level){
        super(level)
        this.box_r = 0.5
        this.name = 'flying mucus'
        this.move_speed = 1
        this.w = 1
    }

    setPoint(x: number = 0, y: number = 0): void{
        this.x = x
        this.y = y
    }

    act(): void { 
        if(this.isOutOfMap()){
            this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
            this.level.deleted.push(this.id)
            return
        }

        let players = this.level.players

        for(let i = 0; i < players.length; i++){
            let p = players[i]
            if(p === this.owner) continue

            if(!p.is_dead && this.w >= p.z && Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())){
                if(!p.isBlock()){
                    let s = new EnvelopingMucus(this.level.time)
                    s.setDuration(5500)
                    this.level.setStatus(p, s)
                }
                else{
                    p.succesefulBlock(this.owner)
                }
                
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