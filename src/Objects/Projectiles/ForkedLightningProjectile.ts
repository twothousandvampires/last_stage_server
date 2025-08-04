import Func from "../../Func.js";
import Level from "../../Level.js";
import Projectiles from "./Projectiles.js";

export class ForkedLightningProjectile extends Projectiles{

    start_x: number | undefined
    start_y: number | undefined
    w: number
    check_rasius: number
    improved_chain_reaction: boolean
    lightning_eye: boolean

    constructor(level: Level, public hitted_ids:any = [], public chance_to_fork = 100){
        super(level)
        this.box_r = 0.5
        this.name = 'lightning'
        this.move_speed = 1.5
        this.w = 1
        this.check_rasius = 15
        this.improved_chain_reaction = false
        this.lightning_eye = false
    }

    setPoint(x: number = 0, y: number = 0): void{
        this.start_x = x
        this.start_y = y
        this.x = x
        this.y = y
    }

    act(): void { 

        if(this.isOutOfMap()){
            this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
            this.level.deleted.push(this.id)
            return
        }

        let enemies = this.level.enemies
        let players = this.level.players

        for(let i = 0; i < players.length; i++){
            let p = players[i]
            if(p === this.owner || this.w < p.z) continue

            if(!p.is_dead && Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse()) && !this.hitted_ids.includes(p.id)){
                this.hitted_ids.push(p.id)
                p.takeDamage(this.owner)
                this.impact()
                return
            }
        }

        for(let i = 0; i < enemies.length; i++){
            let e = enemies[i]
            if(!e.is_dead && Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse()) && !this.hitted_ids.includes(e.id)){
                this.hitted_ids.push(e.id)
                e.takeDamage(this.owner)
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
        let targets:any = []
        
        let radius = this.lightning_eye ? 30 : this.check_rasius
        let max_for_serching_targets = 3 + this.owner.getAdditionalRadius()

        this.level.players.forEach(p => {
            if(!p.is_dead && targets.length < max_for_serching_targets && Func.distance(this, p) <= radius && p != this.owner && !this.hitted_ids.includes(p.id)){
                targets.push(p)
            }
        })

        this.level.enemies.forEach(p => {
            if(!p.is_dead && targets.length < max_for_serching_targets && Func.distance(this, p) <= radius && !this.hitted_ids.includes(p.id)){
                targets.push(p)
            }
        })

        targets.forEach(elem => {
            if(Func.chance(this.chance_to_fork)){

                let reduce_chance = this.improved_chain_reaction ? 15 : 30

                let proj = new ForkedLightningProjectile(this.level, this.hitted_ids, reduce_chance)
                proj.improved_chain_reaction = this.improved_chain_reaction
                proj.lightning_eye = this.lightning_eye

                let angle = Func.angle(this.x, this.y, elem.x, elem.y)
              
                proj.setOwner(this.owner)
                proj.setAngle(angle)
                proj.setPoint(this.x, this.y)

                this.level.projectiles.push(proj)
            }
        })

        this.level.deleted.push(this.id)
        this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
    }
}