import Func from "../../Func.js";
import Level from "../../Level.js";
import Effect from "./Effects.js";
import RuneExplode from "./RuneExplode.js";

export default class Rune extends Effect{

    time: number
    fast_detonation: boolean
    explosive: boolean
    second_detanation: boolean
    already_exploded: boolean
  
    constructor(level: Level){
        super(level)
        this.name = 'rune'
        this.time = Date.now()
        this.box_r = 10
        this.fast_detonation = false
        this.explosive = false
        this.second_detanation = false
        this.already_exploded = false
    }

    explode(){
        let e = new RuneExplode(this.level)
        e.setPoint(this.x, this.y)
        this.level.effects.push(e)

        let box = this.getBoxElipse()

        if(this.explosive){
            box.r +=2
        }

        this.level.enemies.forEach(elem => {
            if(Func.elipseCollision(box, elem.getBoxElipse())){
                elem.takeDamage(this.owner)
            }
        })
         
        this.level.players.forEach(elem => {
            if(Func.elipseCollision(box, elem.getBoxElipse())){
                elem.takeDamage(this.owner)
            }
        })

        if(this.second_detanation && Func.chance(50)){
            setTimeout(() => {
                let e = new RuneExplode(this.level)
                e.setPoint(this.x, this.y)
                this.level.effects.push(e)

                let box = this.getBoxElipse()

                box.r = 5

                if(this.explosive){
                    box.r +=1
                }

                this.level.enemies.forEach(elem => {
                    if(Func.elipseCollision(box, elem.getBoxElipse())){
                        elem.takeDamage(this.owner)
                    }
                })
                
                this.level.players.forEach(elem => {
                    if(Func.elipseCollision(box, elem.getBoxElipse())){
                        elem.takeDamage(this.owner)
                    }
                })

                this.level.deleted.push(this.id)
                this.level.bindedEffects = this.level.bindedEffects.filter(elem => elem != this)
            }, 1200)
        }
        else{
            this.level.deleted.push(this.id)
            this.level.bindedEffects = this.level.bindedEffects.filter(elem => elem != this)
        }
    }

    act(time: number){
        if(this.already_exploded) return

        if(time - this.time >= (this.fast_detonation ? 2500 : 4000)){
            this.explode()
            this.already_exploded = true
        }
    }
}