import CurseOfDamnedAbility from "../../../EnemyAbilities.ts/CurseOfDamnedAbility";
import FanOfBonesAbility from "../../../EnemyAbilities.ts/FanOfBonesAbility";
import GhostGripAbility from "../../../EnemyAbilities.ts/GhostGripAbility";
import LaunchBones from "../../../EnemyAbilities.ts/LaunchBones";
import Level from "../../../Level";
import Undead from "./Undead";

export default class FlyingBones extends Undead {
    spell_name: string | undefined
    can_cast_grip: boolean
    can_cast_bones: boolean
    can_cast_curse: boolean
    retreat_angle: any
    ressurect_chance: number
    want_to_cast: boolean

    constructor(level: Level){
        super(level)
        this.name = 'flying bones'
        this.box_r = 2.2
        this.move_speed = 0.1
        this.attack_radius = 6
        this.attack_speed = 1600
        this.cooldown_attack = 3000
        this.life_status = 2
        this.spawn_time = 1600
        this.can_cast_grip = true
        this.can_cast_bones = true
        this.can_cast_curse = true
        this.create_grace_chance = 40
        this.create_chance = 80
        this.ressurect_chance = 30
        this.want_to_cast = true
        this.gold_revard = 3
        this.create_item_chance = 3
        this.create_sorcerers_skull_chance = 15
        this.abilities = [
            new GhostGripAbility(),
            new FanOfBonesAbility(),
            new CurseOfDamnedAbility()
        ]
    }
}