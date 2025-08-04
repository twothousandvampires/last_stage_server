import Func from "../../Func.js";
import Level from "../../Level.js";
import Effect from "./Effects.js";

export default class StaticFiled extends Effect{

    time: number
    affected: any
    check_timer: number
    last_check: any
    hand_cuffing: boolean
    collapse: boolean

    constructor(level: Level){
        super(level)
        this.name = 'static field'
        this.box_r = 8.5
        this.time = Date.now()
        this.affected = new Map()
        this.check_timer = 1000
        this.hand_cuffing = false
        this.collapse = false
    }

    act(time: number){
        if(time - this.time >= 5000){
            
            this.level.enemies.forEach(elem => {
                if(this.affected.has(elem.id)){
                    elem.move_speed = this.affected.get(elem.id)
                    if(this.hand_cuffing){
                        elem.attack_speed -= 1000   
                    }
                    if(this.collapse && Func.chance(5)){
                        elem.takeDamage(undefined, {
                            instant_death: true
                        })
                    }
                }
            })

            this.level.players.forEach(elem => {
                if(this.affected.has(elem.id)){
                    elem.move_speed = this.affected.get(elem.id)
                    if(this.hand_cuffing){
                        elem.attack_speed -= 1000   
                    }
                    if(this.collapse && Func.chance(5)){
                        elem.takeDamage(undefined, {
                            instant_death: true
                        })
                    }
                }
            })

            this.level.projectiles.forEach(elem => {
                if(this.affected.has(elem.id)){
                    elem.move_speed = this.affected.get(elem.id)
                }
            })

            this.level.deleted.push(this.id)
            this.level.bindedEffects = this.level.bindedEffects.filter(elem => elem != this)

            return
        }

        if(!this.last_check || time - this.last_check >= this.check_timer){
            this.last_check += this.check_timer

            this.level.enemies.forEach(elem => {
                if(!this.affected.has(elem.id) && Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())){
                    this.affected.set(elem.id, elem.move_speed)

                    elem.move_speed = 0
                    if(this.hand_cuffing){
                        elem.attack_speed += 1000   
                    }
                }
            })

            this.level.players.forEach(elem => {
                if(!this.affected.has(elem.id) && Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())){
                    this.affected.set(elem.id, elem.move_speed)
                    elem.move_speed = 0
                    if(this.hand_cuffing){
                        elem.attack_speed += 1000   
                    }
                }
            })

            this.level.projectiles.forEach(elem => {
                if(!this.affected.has(elem.id) && Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())){
                    this.affected.set(elem.id, elem.move_speed)

                    elem.move_speed = 0
                }
            })
        }
    }

}