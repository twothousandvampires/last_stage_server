
import WeaponSwing from "../../../Abilities/Swordman/WeaponSwing";
import Whirlwind from "../../../Abilities/Swordman/Whirlwind";
import Level from "../../../Level";
import Player from "../Character";

export default class Sorcerer extends Player{
    
    weapon_angle: number

    maximum_mana: number
    mana: number
    mana_regeneration_rate: number // ms

    constructor(socket_id: string, level: Level){
        super(socket_id, level)
        this.first_ab = new WeaponSwing(this)
        this.second_ab = new Whirlwind(this)
        this.weapon_angle = 0.8
        this.attack_radius = 7
        this.attack_speed = 1500
        this.name = 'sorcerer'
        this.move_speed = 0.6
        this.avoid_damaged_state_chance = 10
        this.mana_regeneration_rate = 1200
        this.maximum_mana = 10
        this.mana = 10
        this.armour_rate = 5
    }
}