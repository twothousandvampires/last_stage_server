import Func from "../../Func";
import Level from "../../Level";
import Projectiles from "./Projectiles";

export class WeaponFragment extends Projectiles{
    max_distance: number
    hited: boolean
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
        this.hited = false
    }

    setPoint(x: number = 0, y: number = 0): void{
        this.start_x = x
        this.start_y = y
        this.x = x
        this.y = y
    }

    act(): void { 

        if(this.hited){
            if(Math.abs(this.x - this.start_x) <= 0.5 && Math.abs(this.y - this.start_y) <= 0.5){
                this.impact()
                return
            }
        }
        else{
            if(Math.sqrt(((this.x - this.start_x) ** 2) + ((this.y - this.start_y) ** 2)) >= this.max_distance){
                 this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
                 this.level.deleted.push(this.id)
                 return
            }
        }
  
        if(!this.hited){
            for(let i = 0; i < this.level.players.length; i++){
                let p = this.level.players[i]

                if(p != this.owner && Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())){
                
                    p.takeDamage(this.owner)

                    if(!this.point_added){
                        if(this.owner){
                            this.point_added = true
                        }
                    }
                    
                    this.impact()
                }
            }

            for(let i = 0; i < this.level.enemies.length; i++){
                let e = this.level.enemies[i]

                if(Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse())){
                    e.takeDamage(this.owner)
        
                    if(!this.point_added){
                        this.point_added = true
                    }

                    this.impact()
                }
            }
        }

        this.moveAct()
    }

    impact(){
        if(this.hited){
            let b = this.getBoxElipse()

            if(this.owner){
                if(Func.elipseCollision(this.owner.getBoxElipse(), b)){
                    if(this.owner){
                        this.owner.armour_rate += 4
                        setTimeout(() => {
                            if(this.owner){
                                this.owner.armour_rate -= 4 
                            }
                        }, 4000);
                    }
                   
                }
            }
        
            this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
            this.level.deleted.push(this.id)
        }
        else{
            this.hited = true
            this.angle = Func.angle(this.x, this.y, this.start_x, this.start_y)
        }
    }
}