import EnemyBuilder from "../../../Classes/EnemyBuilder";
import Level from "../../../Level";
import UndeadDeadState from "../../../State/UndeadDeadState";
import Enemy from "./Enemy";

export default class Undead extends Enemy {

    ressurect_chance: number = 0

    constructor(level: Level){
        super(level)
        this.name = 'undead'
    }

    takeDamage(unit: any = undefined, options: any = {}){
        super.takeDamage(unit, options)

        if(this.life_status <= 0 && unit?.blessed){
            this.ressurect_chance = Math.round(this.ressurect_chance / 2)
        }
    }

    getDeadStateInstance(){
        return new UndeadDeadState()
    }

    getWeaponHitedSound(){
        return  {
            name: 'hit bones',
            x:this.x,
            y:this.y
        }
    }

    getExplodedSound(){
        return {
            name: 'bones explode',
            x: this.x,
            y: this.y
        }
    }
}