import Func from "../../../Func";
import Level from "../../../Level";
import CurseOfDamned from "../../../Status/CurseOfDamned";
import GhostGrip from "../../../Status/GhostGrip";
import GhostGripArea from "../../Effects/GhostGripArea";
import SmallTextLanguage3 from "../../Effects/SmallTextLanguage3";
import { SharpedBone } from "../../Projectiles/SharpedBone";
import Bones from "./Bones";
import { Enemy } from "./Enemy";
import Skull from "./Skull";

export default class FlyingBones extends Enemy{
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

            if(!this.target) return

            this.level.sounds.push({
                    name:'dark cast',
                    x: this.x,
                    y: this.y
            })

            if(this.spell_name === 'bones'){
                
                let bone_count = this.level.enemies.filter(elem => elem instanceof Bones && Func.distance(this, elem) <= 20).length
                bone_count ++

                if(bone_count > 12){
                    bone_count = 12
                }

                let angle = Func.angle(this.x, this.y, this.target?.x, this.target?.y)

                for(let i = 0; i < bone_count; i++){
                    let proj = new SharpedBone(this.level)
                    proj.setPoint(this.x, this.y)

                    let a = angle + i * 0.15

                    proj.setAngle(a)

                    this.level.projectiles.push(proj)
                }
            }
            else if(this.spell_name === 'ghost grip'){
                let ppl = this.level.players.filter(elem => Func.distance(elem, this) <= 30)

                let e = new GhostGripArea(this.level)
                e.setPoint(this.x, this.y)
                this.level.effects.push(e)
                
                ppl.forEach(elem => {
                    let status = new GhostGrip(elem.time)
                    status.setDuration(4000)
                    this.level.setStatus(elem, status)
                })
                
            }  
            else if(this.spell_name === 'curse'){
                let status = new CurseOfDamned(this.target.time)
                status.setDuration(4000)
                this.level.setStatus(this.target, status)
            }        
        }
    }

    setAttackState(){
        this.state = 'attack'
        this.is_attacking = true
        this.stateAct = this.attackAct
        this.action_time = this.attack_speed
        this.setImpactTime(75)

        this.cancelAct = () => {
            this.action = false
            this.hit = false
            this.is_attacking = false
        }

        this.setTimerToGetState(this.attack_speed)
    }
    retreatAct(){
            let a = this.retreat_angle
    
            if(!a) return
            
            this.moveByAngle(a)
    }
    
    setRetreatState(){
        this.state = 'move'
        this.retreat_angle = Func.angle(this.target?.x, this.target.y,this.x, this.y)
        this.retreat_angle += Math.random() * 1.57 * (Func.random(50) ? -1 : 1)

        this.stateAct = this.retreatAct

        this.cancelAct = () => {
            this.retreat_angle = undefined
        }

        this.setTimerToGetState(2000)
    }

    idleAct(tick){
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
            
            if(this.can_cast_grip && Func.distance(this, this.target) <= 10){
                this.spell_name = 'ghost grip'
                this.can_cast_grip = false
                setTimeout(() => {
                    this.can_cast_grip = true
                }, 10000)
            }
            else if(this.can_cast_bones && Func.distance(this, this.target) <= 30){
                this.spell_name = 'bones'
                this.can_cast_bones = false
                setTimeout(() => {
                    this.can_cast_bones = true
                }, 10000)
            }
            else if(this.can_cast_curse && Func.distance(this, this.target) <= 20){
                this.spell_name = 'curse'
                this.can_cast_curse = false
                setTimeout(() => {
                    this.can_cast_curse = true
                }, 12000)
            }

            setTimeout(() => {
                this.want_to_cast = true
            }, Func.random(3000, 6000))
        }
       
        //todo can cast
        if(this.spell_name){
            this.setState(this.setAttackState)
            return
        }

        else if(Func.distance(this, this.target) <= 8 && Func.chance(70)){
            this.setState(this.setRetreatState)
        }
        else{
            this.setState(this.setIdleAct)
        }
    }
}