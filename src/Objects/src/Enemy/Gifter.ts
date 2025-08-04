import Func from "../../../Func";
import Level from "../../../Level";
import GraceShard from "../../Effects/GraceShard";
import RuneExplode from "../../Effects/RuneExplode";
import Pile from "../Piles/Pile";

export default class Gifter extends Pile{

    start_time: any

    constructor(level: Level){
        super(level)
        this.name = 'gifter'
        this.box_r = 2.4
        this.move_speed = 0
        this.attack_radius = 0
        this.attack_speed = 1600
        this.life_status = 10
        this.spawn_time = 1600
        this.armour_rate = 0
        this.create_chance = 0
        this.getState()
    }

    getState(): void {
        this.start_time = Date.now()
        this.setState(this.setIdleAct)
    }

    idleAct(tick: number){
        if(tick - this.start_time >= 20000){
            let hit = this.getBoxElipse()
            hit.r = 10

            this.level.players.forEach(elem => {
                if(Func.elipseCollision(elem.getBoxElipse(), hit)){
                    elem.takeDamage()
                }
            })

            let e = new RuneExplode(this.level)
            e.setPoint(this.x, this.y)
            this.level.effects.push(e)

            this.is_dead = true
            this.is_corpse = true
            this.state = 'dead'
        }
    }

    takeDamage(unit: any = undefined, options: any = {}){
        if(this.is_dead) return
        
        this.life_status --

        if(options?.damage_value){
            this.life_status -= options.damage_value
        }
        else{
            this.life_status --
        }

        if(unit?.critical && Func.chance(unit.critical)){
            this.life_status --
        }

        if(this.life_status <= 0){
            this.is_dead = true
            unit?.succesefulKill()
            this.setDyingAct()
        }
        else{
            unit?.succesefulHit()
        }
    }

    setDyingAct(){
        for(let i = 0; i < 10; i++){
           
            let add = Math.round(i / 3)
            let distance_x = Func.random(1, 3) + add
            let distance_y = Func.random(1, 3) + add
            let angle = Math.random() * 6.28

            let x = this.x + (Math.sin(angle) * distance_x)
            let y = this.y + (Math.cos(angle) * distance_y)

            let grace = new GraceShard(this.level)
            grace.setPoint(x, y)

            this.level.bindedEffects.push(grace)
        } 

        this.is_corpse = true
        this.state = 'dead'
    }
}