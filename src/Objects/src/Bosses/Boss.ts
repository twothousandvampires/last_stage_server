import Builder from "../../../Classes/Builder";
import BlindAbility from "../../../EnemyAbilities.ts/BlindAbility";
import DespairAbility from "../../../EnemyAbilities.ts/DespairAbility";
import FanOfBonesAbility from "../../../EnemyAbilities.ts/FanOfBonesAbility";
import UnholyTouch from "../../../EnemyAbilities.ts/UnholyTouch";
import Level from "../../../Level";
import ApathyAura from "../../../Status/ApathyAura";
import UnholyPower from "../../../Status/UnholyPower";
import Undead from "../Enemy/Undead";

export default class Boss extends Undead {

    static SPAWN_COUNT: number = 1

    constructor(level: Level){
        super(level)
        this.name = 'boss'
        this.box_r = 4
        this.move_speed = 0.05
        this.attack_radius = 6
        this.attack_speed = 1600
        this.player_check_radius = 50
        this.spawn_time = 2200
        this.phasing = true
        this.can_be_instant_killed = false
        this.abilities = [
            new UnholyTouch(),
            new BlindAbility()
        ]
        this.immune_to_freeze = true
        this.immune_to_stun = true

        this.init()
        this.gold_revard = 30
        this.can_be_removed = false
        this.can_be_burned = false
    }

    init(){
        this.life_status = 30 * Boss.SPAWN_COUNT

        Boss.SPAWN_COUNT ++

        let s = new UnholyPower(this.level.time)

        this.level.setStatus(this, s)

        this.level.setStatus(this, new ApathyAura(this.level.time))
    }

    takeDamage(unit: any = undefined, options = {}){
        super.takeDamage(unit, options)
      
        if(this.life_status <= 0){
            this.level.players.forEach(elem => {
                let mastery = Builder.createRandomMastery()
                elem.masteries.push(mastery)
                elem.level.addMessedge('you have got ' + mastery.name + ' mastery', elem.id)
            })
            this.level.script.end(this.level)
        }
    }
}