import Func from "../../../Func";
import Level from "../../../Level";
import GraceShard from "../../Effects/GraceShard";
import RuneExplode from "../../Effects/RuneExplode";
import Pile from "../Piles/Pile";

export default class Gifter extends Pile {

    start_time: any
    last_grace_spawn_time: number = 0

    constructor(level: Level){
        super(level)
        this.name = 'gifter'
        this.box_r = 2.4
        this.move_speed = 0
        this.attack_radius = 0
        this.attack_speed = 1600
        this.life_status = 100
        this.spawn_time = 1600
        this.armour_rate = 0
        this.create_chance = 0
        this.abilities = []
        this.duration = 20000
    }

    takeDamage(unit: any = undefined, options: any = {}){
        super.takeDamage()

        if(this.level.time - this.last_grace_spawn_time >= 1000){
            if(Func.chance(30)){
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
            }
            else{
                this.last_grace_spawn_time = this.level.time
            
                let add = Func.random(3, 7)
                let distance_x = Func.random(1, 3) + add
                let distance_y = Func.random(1, 3) + add
                let angle = Math.random() * 6.28

                let x = this.x + (Math.sin(angle) * distance_x)
                let y = this.y + (Math.cos(angle) * distance_y)

                let grace = new GraceShard(this.level)
                grace.setPoint(x, y)

                this.level.binded_effects.push(grace)
            }
        }
    }
}