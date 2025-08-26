import Func from "../../Func";
import Level from "../../Level";
import Projectiles from "./Projectiles";
import { ThrowedWeaponShard } from "./ThrowedWeaponShard";

export class ThrowedWeapon extends Projectiles{
    max_distance: number
    max_count: number
    hited: any[]
    start_x: number | undefined
    start_y: number | undefined
    point_added: boolean
    returned: boolean
    shattered: boolean
    can_hit_player: boolean

    constructor(level: Level){
        super(level)
        this.box_r = 0.5
        this.name = 'throwed_weapon'
        this.move_speed = 1
        this.max_distance = 30
        this.hited = []
        this.point_added = false
        this.returned = false
        this.shattered = false
        this.can_hit_player = false
    }

    setPoint(x: number = 0, y: number = 0): void{
        this.start_x = x
        this.start_y = y
        this.x = x
        this.y = y
    }

    act(): void { 

        if(Math.sqrt(((this.x - this.start_x) ** 2) + ((this.y - this.start_y) ** 2)) >= this.max_distance + (this.owner.might * 10)){
            this.impact()
            return
        }

        let box = this.getBoxElipse()
        box.r = (this.owner?.attack_radius / 10)

        for(let i = 0; i < this.level.players.length; i++){
            let p = this.level.players[i]

            if((p != this.owner || (this.can_hit_player && p === this.owner)) && !this.hited.includes(p) && Func.elipseCollision(box, p.getBoxElipse())){
                this.hited.push(p)
                p.takeDamage(this.owner)
                this.level.addSound(p.getWeaponHitedSound())

                if(!this.point_added){
                    this.owner?.addPoint()
                    this.point_added = true
                }
                if(this.owner.getTargetsCount() <= this.hited.length){
                    this.impact()
                }
            }
        }

        for(let i = 0; i < this.level.enemies.length; i++){
            let e = this.level.enemies[i]

            if(!this.hited.includes(e) && Func.elipseCollision(box, e.getBoxElipse())){
                this.hited.push(e)
                e.takeDamage(this.owner)
                this.level.addSound(e.getWeaponHitedSound())
    
                if(!this.point_added){
                    this.owner?.addPoint()
                    this.point_added = true
                }
                if(this.owner.getTargetsCount() <= this.hited.length){
                    this.impact()
                }
            }
        }

        let l = 1 - Math.abs(0.5 * Math.cos(this.angle))

        let n_x = Math.sin(this.angle) * l
        let n_y = Math.cos(this.angle) * l

        n_x *= this.move_speed
        n_y *= this.move_speed

        if(this.isOutOfMap(this.x + n_x, this.y + n_y)){
            this.impact()
            return
        }
        else{
            if(n_x < 0){
                this.flipped = true
            }
            else{
                this.flipped = false
            }

             this.addToPoint(n_x, n_y)
        } 
    }

    impact(){
        if(this.returned){
            let returned = new ThrowedWeapon(this.level)
            returned.setOwner(this.owner)
            returned.setPoint(this.x, this.y)
            returned.setAngle(Func.angle(this.x, this.y, this.start_x, this.start_y))
            returned.can_hit_player = true
            returned.point_added = true
            
            this.level.projectiles.push(returned)
        }
        else if(this.shattered){
            let count = Func.random(2, 5)
            
            let zones = 6.28 / count
    
            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new ThrowedWeaponShard(this.level)
                proj.setAngle(angle)
                proj.setPoint(this.x, this.y)
                proj.setOwner(this.owner)
             
               
    
                this.level.projectiles.push(proj)
            }

        }

        this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
        this.level.deleted.push(this.id)
    }
}