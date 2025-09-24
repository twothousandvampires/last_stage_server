import Func from "../../../Func";
import Level from "../../../Level";
import { MagicStar } from "../../Projectiles/MagicStar";
import Pile from "../Piles/Pile";

export default class Statue extends Pile{
    look_angle: any
    casted: boolean

    constructor(level: Level){
        super(level)
        this.name = 'statue'
        this.box_r = 4
        this.frequency = 4000
        this.cast_time = 1400
        this.casted = false
        this.create_chance = 0
        this.count_as_killed = false
        this.getState()
    }

    idleAct(time: number){
        for(let i = 0; i < this.level.players.length; i++){
            let p = this.level.players[i]
            let box = this.getBoxElipse()
            box.r += 2

            if(Func.elipseCollision(box, p.getBoxElipse())){
                this.setCastState()
                return
            }
        }
    }

    takeDamage(unit: any = undefined, options: any = {}){
        return

        if(this.is_dead) return
        
        if(options?.instant_death){
            unit?.succesefulKill()
            this.is_dead = true
            this.setdyingAct()
            return
        }

        this.life_status --

        if(unit?.critical && Func.chance(unit.critical)){
            this.life_status --
        }

        if(this.life_status <= 0){
            this.is_dead = true
            this.create_grace_chance += unit?.chance_to_create_grace ? unit?.chance_to_create_grace : 0
            unit?.succesefulKill()
            this.setdyingAct()
        }
        else{
            unit?.succesefulHit()
        }
    }

    setCastState(){
        this.state = 'cast'
        this.is_attacking = true
        this.stateAct = this.castAct
        this.action_time = this.cast_time
        this.setImpactTime(95)

        this.cancelAct = () => {
            this.action = false
            this.is_attacking = false
            this.hit = false
        }

        this.setTimerToGetState(this.cast_time)
    }

    castAct(){
        if(this.action && !this.hit){
            this.hit = true

            let star = new MagicStar(this.level)
            star.setAngle(this.look_angle)
            star.x = this.x
            star.y = this.y
            
            this.level.projectiles.push(star)

            let star2 = new MagicStar(this.level)
            star2.setAngle(this.look_angle - 0.31)
            star2.x = this.x
            star2.y = this.y
            
            this.level.projectiles.push(star2)

            let star3 = new MagicStar(this.level)
            star3.setAngle(this.look_angle + 0.31)
            star3.x = this.x
            star3.y = this.y
            
            this.level.projectiles.push(star3)
        }
    }
}