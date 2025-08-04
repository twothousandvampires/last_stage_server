
import Func from "../../Func.js";
import Level from "../../Level.js";
import Drained from "../../Status/Drained.js";
import Projectiles from "./Projectiles.js";

export class SpecterSoulSeeker extends Projectiles{
    w: number
    start_x: number | undefined
    start_y: number | undefined
    max_distance: number
    target: any
  
    constructor(level: Level){
        super(level)
        this.box_r = 0.4
        this.name = 'specter soul seeker'
        this.move_speed = 0.3
        this.w = 3
        this.max_distance = 35
    }

    setPoint(x: number = 0, y: number = 0): void{
        this.start_x = x
        this.start_y = y
        this.x = x
        this.y = y
    }

    act(): void { 

        this.level.players.forEach(elem => {
            if(Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())){
                let status = new Drained(elem.time, 6000)
                this.level.setStatus(elem, status)
                this.owner?.move_speed += 0.1
                
                if(this.owner?.attack_speed > 800){
                    this.owner?.attack_speed -= 100
                }
                this.impact()
            }
        })

        if(this.isOutOfMap()){
            this.impact()
            return
        }

        let traveled = Math.sqrt(((this.x - this.start_x) ** 2) + ((this.y - this.start_y) ** 2))

        if(traveled >= this.max_distance){
            this.impact()
            return
        }

        if(!this.target){
            this.target = this.level.players.filter(elem => Func.distance(this, elem) <= 8)[0]
        }

        if(this.target){
            this.angle = Func.angle(this.x, this.y, this.target.x, this.target.y)
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