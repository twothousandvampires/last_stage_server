import DespairAbility from "../../../EnemyAbilities.ts/DespairAbility";
import FanOfBonesAbility from "../../../EnemyAbilities.ts/FanOfBonesAbility";
import Level from "../../../Level";
import ApathyAura from "../../../Status/ApathyAura";
import Undead from "../Enemy/Undead";

export default class Boss extends Undead {

    apathy_radius: number
    constructor(level: Level){
        super(level)
        this.name = 'boss'
        this.box_r = 4
        this.move_speed = 0.05
        this.attack_radius = 6
        this.attack_speed = 1600
        this.player_check_radius = 50
        this.life_status = 30
        this.spawn_time = 2200
        this.apathy_radius = 10
        this.level.setStatus(this, new ApathyAura(this.level.time))
        this.phasing = true
        this.can_be_instant_killed = false
        this.abilities = [
            new DespairAbility(),
            new FanOfBonesAbility()
        ]
    }

    takeDamage(unit: any = undefined, options = {}){
        super.takeDamage(unit, options)
        if(this.life_status <= 0){
            this.level.script.end(this.level)
        }

    }
}