import Func from "../../Func";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import Ability from "../Ability";
import CultistAbility from "./CultistAbility";

export default class Slam extends CultistAbility {

    slaming: boolean
    soul_extraction: boolean

    constructor(owner: Cultist){
        super(owner)
        this.name = 'slam'
        this.slaming = false
        this.soul_extraction = false
        this.type = Ability.TYPE_ATTACK
    }

    impact(){
        let second_resource = this.owner.getSecondResource()

        if(this.soul_extraction){
            this.owner.chance_to_create_grace += 10
        }

        let enemies = this.owner.level.enemies
        let players = this.owner.level.players 

        let rel_distance = Math.sqrt(((this.owner.x - this.owner.c_x) ** 2) + ((this.owner.y - this.owner.c_y) ** 2))

        let total_radius = this.owner.attack_radius + Math.round(second_resource / 2)

        let distance = rel_distance > total_radius ? total_radius : rel_distance

        let hit_x = this.owner.x + (Math.sin(this.owner.attack_angle) * distance)
        let hit_y = this.owner.y + (Math.cos(this.owner.attack_angle) * distance)

        let r = this.owner.getBoxElipse()
        r.r = this.owner.attack_point_radius
        r.x = hit_x
        r.y = hit_y

        if(this.slaming){
            r.r += 3
        }

        this.owner.level.addSound({
            name:'blow',
            x: this.owner.x,
            y: this.owner.y
        })

        let f = enemies.filter(elem => Func.elipseCollision(r, elem.getBoxElipse()))
        let p = players.filter(elem => Func.elipseCollision(r, elem.getBoxElipse()) && elem != this.owner)
        
        f.concat(p).forEach(elem => {
            elem.takeDamage(this.owner)
        })

        if(this.soul_extraction){
            this.owner.chance_to_create_grace -= 10
        }

        this.afterUse()
    }
}