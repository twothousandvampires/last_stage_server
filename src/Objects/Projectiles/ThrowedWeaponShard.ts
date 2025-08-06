import Func from "../../Func";
import Level from "../../Level";
import Projectiles from "./Projectiles";

export class ThrowedWeaponShard extends Projectiles{
    max_distance: number
    start_x: number | undefined
    start_y: number | undefined
    point_added: boolean

    constructor(level: Level){
        super(level)
        this.box_r = 0.5
        this.name = 'weapon fragment'
        this.move_speed = 1
        this.max_distance = 18
        this.point_added = false
    }

    setPoint(x: number = 0, y: number = 0): void{
        this.start_x = x
        this.start_y = y
        this.x = x
        this.y = y
    }

    act(): void { 

        if(Math.sqrt(((this.x - this.start_x) ** 2) + ((this.y - this.start_y) ** 2)) >= this.max_distance){
                this.impact()
                return
        }
        
        if(this.isOutOfMap()){
            this.impact()
            return
        }

        
        for(let i = 0; i < this.level.players.length; i++){
            let p = this.level.players[i]

            if(Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())){
            
                p.takeDamage(this.owner)
                this.level.addSoundObject(p.getWeaponHitedSound())

                if(!this.point_added){
                    this.owner?.addPoint()
                    this.point_added = true
                }
                
                this.impact()
            }
        }

        for(let i = 0; i < this.level.enemies.length; i++){
            let e = this.level.enemies[i]

            if(!e.is_dead && Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse())){
                
                e.takeDamage(this.owner)
                this.level.addSoundObject(e.getWeaponHitedSound())
    
                if(!this.point_added){
                    this.owner?.addPoint()
                    this.point_added = true
                }

                this.impact()
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
        this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
        this.level.deleted.push(this.id)
    }
}