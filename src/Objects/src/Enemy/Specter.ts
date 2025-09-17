import Func from "../../../Func";
import Level from "../../../Level";
import Poison from "../../../Status/Poison";
import Armour from "../../Effects/Armour";
import SmallTextLanguage3 from "../../Effects/SmallTextLanguage3";
import SpecterVortex from "../../Effects/SpecterVortex";
import { SpecterSoulSeeker } from "../../Projectiles/SpecterSoulSeeker";
import { Enemy } from "./Enemy";
import Skull from "./Skull";

export default class Specter extends Enemy{

    ressurect_chance: number
    want_to_cast: boolean
    spell_name: string | undefined
    can_cast_vortex: boolean
    can_cast_seekers: boolean

    constructor(level: Level){
        super(level)
        this.name = 'specter'
        this.box_r = 2.5
        this.move_speed = 0.05
        this.attack_radius = 7
        this.attack_speed = 2000
        this.life_status = 2
        this.spawn_time = 1600
        this.ressurect_chance = 30
        this.armour_rate = 70
        this.want_to_cast = true
        this.can_cast_vortex = true
        this.can_cast_seekers = true
        this.create_grace_chance = 90
        this.create_chance = 90
        this.gold_revard = 5
        this.create_item_chance = 12

        this.getState()
    }

    takeDamage(unit: any = undefined, options: any = {}){
        super.takeDamage(unit, options)

        if(this.life_status <= 0 && unit?.blessed){
            this.ressurect_chance = Math.round(this.ressurect_chance / 2)
        }
    }

    setDeadState(){
       
        if(!this.freezed && this.state != 'burn_dying' && !Func.chance(this.ressurect_chance)){
            this.is_corpse = true
            this.state = 'dead'
            this.stateAct = this.deadAct
            let skull = new Skull(this.level)
            skull.setPoint(this.x, this.y)
            this.level.enemies.push(skull)
        }
        else{
            this.phasing = true
            this.state = 'dead_with_skull'
            this.stateAct = this.deadAct
            setTimeout(() => {
                this.setState(this.setResurectAct)
            }, 3000)
        }
    }

    public sayPhrase(): void{
        if(!Func.chance(1)) return

        let phrase = new SmallTextLanguage3(this.level)
        phrase.z = 12
        phrase.setPoint(this.x, this.y)

        this.level.effects.push(phrase)
    }

    getWeaponHitedSound(){
        return  {
            name: 'hit bones',
            x:this.x,
            y:this.y
        }
    }

    ressurectAct(){

    }

    setResurectAct(){
        this.state = 'ressurect'
        this.stateAct = this.ressurectAct
        this.phasing = false
        setTimeout(() => {
            this.is_dead = false
            this.getState()
        }, 1500)
    }
    moveAct(){
        this.state = 'move'

        let a = Func.angle(this.x, this.y, this.target.x, this.target.y)

        this.moveByAngle(a)
    }

    getExplodedSound(){
        return {
            name: 'bones explode',
            x: this.x,
            y: this.y
        }
    }

    attackAct(){
        if(this.action && !this.hit){
            this.hit = true
            this.level.sounds.push({
                x: this.x,
                y: this.y,
                name: 'specter attack'
            })
            let e = this.getBoxElipse()
            e.r = this.attack_radius

            if(this.target?.z < 5 && Func.checkAngle(this, this.target, this.attack_angle, 1.6) && Func.elipseCollision(e, this.target?.getBoxElipse())){
                this.target?.takeDamage(this)
            }
        }
    }

    setAttackState(){
        this.state = 'attack'
        this.is_attacking = true
        this.stateAct = this.attackAct
        this.action_time = this.attack_speed
        this.setImpactTime(90)

        this.attack_angle = Func.angle(this.x, this.y, this.target?.x, this.target?.y)

        this.cancelAct = () => {
            this.action = false
            this.hit = false
            this.is_attacking = false
            this.attack_angle = undefined
        }

        this.setTimerToGetState(this.attack_speed)
    }

    idleAct(){
        if(this.can_check_player){
           if(!this.target){
                this.can_check_player = false
            
                let p = this.level.players.filter(elem => Func.distance(this, elem) <= this.player_check_radius && !elem.is_dead && elem.z < 5)

                p.sort((a, b) => {
                    return Func.distance(a, this) - Func.distance(b, this)
                })

                this.target = p[0]
           }
           else{
                if(Func.distance(this, this.target) > this.player_check_radius || this.target.is_dead){
                    this.target = undefined
                }
           }
           
           setTimeout(() => {
                this.can_check_player = true
           }, 2000)
        }
       
        if(!this.target){
            return
        } 

        this.spell_name = undefined
        
        if(this.want_to_cast){
            this.want_to_cast = false
            let d = Func.distance(this, this.target)
            if(this.can_cast_vortex && d <= 12 && d > 5){
                this.spell_name = 'vortex'
                this.can_cast_vortex = false
                setTimeout(() => {
                    this.can_cast_vortex = true
                }, 20000)
            }
            else if(this.can_cast_seekers && d <= 30 && d > 5){
                this.spell_name = 'soul seekers'
                this.can_cast_seekers = false
                setTimeout(() => {
                    this.can_cast_seekers = true
                }, 25000)
            }
           
            setTimeout(() => {
                this.want_to_cast = true
            }, Func.random(6000, 12000))
        }

        if(this.spell_name){
            this.setState(this.setCastState)
          
        }
        else{
            let a_e = this.getBoxElipse()
            a_e.r = this.attack_radius

            if(Func.elipseCollision(a_e, this.target.getBoxElipse())){
                
                this.setState(this.setAttackState)
            }
            else{
                this.moveAct()
            }
        }
    }

      setCastState(){
        this.state = 'cast'
        this.is_attacking = true
        this.stateAct = this.castAct
        this.action_time = 2000

        this.cancelAct = () => {
            this.action = false
            this.is_attacking = false
        }

        this.setTimerToGetState(2000)
    }

    castAct(){
            if(this.action && !this.hit){
                this.hit = true

                if(!this.target) return

                this.level.sounds.push({
                        name:'dark cast',
                        x: this.x,
                        y: this.y
                })
    
                if(this.spell_name === 'vortex'){
                    let vortex = new SpecterVortex(this.level)
                    vortex.setOwner(this)
                    vortex.setPoint(this.x, this.y)

                    this.level.binded_effects.push(vortex)
                }
                else if(this.spell_name === 'soul seekers'){
                    let c = 8
                    let zones = 6.28 / c
                    
                    for(let i = 1; i <= c; i++){
                        let min_a = (i - 1) * zones
                        let max_a = i * zones
            
                        let angle = Math.random() * (max_a - min_a) + min_a
                        let proj = new SpecterSoulSeeker(this.level)
                        proj.setAngle(angle)
                        proj.setPoint(this.x, this.y)
                        proj.setOwner(this)
            
                        this.level.projectiles.push(proj)
                    }
                }        
            }
        }
}