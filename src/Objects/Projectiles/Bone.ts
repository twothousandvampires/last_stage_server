import Func from "../../Func";
import Level from "../../Level";
import Projectiles from "./Projectiles";

export class Bone extends Projectiles{
    w: number

    constructor(level: Level){
        super(level)
        this.box_r = 0.3
        this.name = 'sharped bone'
        this.move_speed = 0.9
        this.w = 3
    }

    act(): void { 
        for(let i = 0; i < this.level.players.length; i++){
            let p = this.level.players[i]

            if(p != this.owner && !p.is_dead && p.z < this.w && Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())){
                p.takeDamage(this.owner)
                this.impact()
                return
            }
        }

        for(let i = 0; i < this.level.enemies.length; i++){
            let p = this.level.enemies[i]

            if(!p.is_dead && p.z < this.w && Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())){
                p.takeDamage(this.owner)
                this.impact()
                return
            }
        }

        this.moveAct()
    }
}