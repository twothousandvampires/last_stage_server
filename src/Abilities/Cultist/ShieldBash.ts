import Func from "../../Func";
import { Bone } from "../../Objects/Projectiles/Bone";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import Ability from "../Ability";
import CultistAbility from "./CultistAbility";

export default class ShieldBash extends CultistAbility {

    deafening_wave: boolean
    hate: boolean
    coordination: boolean

    constructor(owner: Cultist){
        super(owner)
        this.name = 'shield bash'
        this.deafening_wave = false
        this.hate = false
        this.coordination = false
        this.cost = 4
        this.cd = 5000
        this.type = Ability.TYPE_ATTACK
        this.state_sprite = 'shield hit'
    }

    afterUse(forced_cd: number | undefined = undefined) {

        this.after_use_triggers.forEach(elem => {
            elem.trigger(this.owner, this)
        })
        
        if(this.need_to_pay){
            this.owner.payCost()
        }

        this.owner.succefullCast()
        
        if(this.cd === 0) return
        
        this.used = true
        
        let cd = forced_cd ? forced_cd : this.getCd()

        if(this.coordination && Func.chance(30)){
            cd = Math.floor(cd / 2)
        }

        setTimeout(() => {
            this.used = false
        }, cd)
    }

    impact(){
        let second_resource = this.owner.getSecondResource()
        
        let enemies = this.owner.level.enemies
        let players = this.owner.level.players 
        let attack_elipse = this.owner.getBoxElipse()

        attack_elipse.r = 8

        let f = enemies.filter(elem => Func.checkAngle(this.owner, elem, this.owner.attack_angle, this.owner.weapon_angle))
        let p = players.filter(elem => Func.checkAngle(this.owner, elem, this.owner.attack_angle, this.owner.weapon_angle))
        let filtered_to_damage = f.filter(elem => Func.elipseCollision(attack_elipse, elem.getBoxElipse()))
        let filtered_to_damage_players = p.filter(elem => Func.elipseCollision(attack_elipse, elem.getBoxElipse()))

        filtered_to_damage.concat(filtered_to_damage_players).forEach(elem => {
            if(this.hate && Func.chance(40)){

            elem.takeDamage(this.owner, {
                explode: true
            })

            if(elem.is_dead){
                let count = Func.random(1, 1 + second_resource)
                
                let zones = 6.28 / count
        
                for(let i = 1; i <= count; i++){
                    let min_a = (i - 1) * zones
                    let max_a = i * zones
        
                    let angle = Math.random() * (max_a - min_a) + min_a
                    let proj = new Bone(this.owner.level)
                    proj.setOwner(this.owner)
                    proj.setAngle(angle)
                    proj.setPoint(elem.x, elem.y)
        
                    this.owner.level.projectiles.push(proj)
                }
            }
            }
            else{
                elem.takeDamage(this.owner)
            }   
        })

        if(!this.hate){
            let stan_duration = this.deafening_wave ? 3500 : 2000
            stan_duration += second_resource * 100
            attack_elipse.r = 12

            if(this.deafening_wave){
                attack_elipse.r += 10
            }
            let filtered_to_stun = f.filter(elem => Func.elipseCollision(attack_elipse, elem.getBoxElipse()))
            filtered_to_stun.forEach(elem => {
                if(!elem.is_dead){
                    elem.setStun(stan_duration)
                }
            })
        }
     
        this.owner.level.sounds.push({
            name:'ground hit',
            x: this.owner.x,
            y: this.owner.y
        })
    }
}