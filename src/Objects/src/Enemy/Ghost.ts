import Func from "../../../Func";
import Level from "../../../Level";
import Despair from "../../../Status/Despair";
import SmallTextLanguage3 from "../../Effects/SmallTextLanguage3";
import { FrostBolt } from "../../Projectiles/FrostBolt";
import { Enemy } from "./Enemy";

export default class Ghost extends Enemy{
    spell_name: string | undefined
    retreat_angle: any
    want_to_cast: boolean
    ressurect_chance: number = 35
    can_cast_despair: boolean = true
    can_cast_frost_bolts: boolean = true

    constructor(level: Level){
        super(level)
        this.name = 'ghost'
        this.box_r = 2.2
        this.move_speed = 0.2
        this.attack_radius = 6
        this.attack_speed = 1600
        this.cast_speed = 1600
        this.life_status = 2
        this.spawn_time = 1400
        this.create_grace_chance = 30
        this.create_chance = 80
        this.want_to_cast = true
        this.gold_revard = 4
        this.invisible = false
        this.can_be_burned = false
        this.dying_time = 1200
        this.phasing = true
       
        this.getState()
    }

    setResurectAct(){
        this.state = 'ressurect'
        this.stateAct = this.ressurectAct

        setTimeout(() => {
            this.is_dead = false
            this.invisible = true
            this.getState()
        }, 1500)
    }

    toJSON(){
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            state: this.state,
            flipped: this.flipped,
            name: this.name,
            z: this.z,
            action: this.action,
            action_time: this.action_time,
            invisible: this.invisible
        }
    }

     takeDamage(unit: any = undefined, options: any = {}){
        super.takeDamage(unit, options)

        if(this.life_status <= 0 && unit?.blessed){
            this.ressurect_chance = Math.round(this.ressurect_chance / 2)
        }
    }

    setStun(duration: number){

    }

    setDeadState(){
        if(!this.freezed && this.state != 'burn_dying' && !Func.chance(this.ressurect_chance)){
            this.is_corpse = true
            this.state = 'dead'
            this.stateAct = this.deadAct
        }
        else{
            this.state = 'fake_dead'
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

    setSpawsState(){
        this.state = 'spawn'
        this.stateAct = this.spawnAct

        this.cancelAct = () => {
            this.invisible = true
            this.is_spawning = false
        }

        this.setTimerToGetState(this.spawn_time)
    }

    setFreezeState(){
        this.freezed = true
        this.state = 'freezed'     
        this.invisible = false
        this.stateAct = this.freezedAct

        this.cancelAct = () => {
            if(!this.is_dead){
                this.freezed = false
                this.invisible = true
            }
        }
    }

    setZapedAct(){     
        this.state = 'zaped'     
        this.zaped = true
        this.stateAct = this.zapedAct
        this.invisible = false

        this.cancelAct = () => {
            this.zaped = false
            this.invisible = true
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

            if(this.spell_name === 'frost bolts'){
                let angle = Func.angle(this.x, this.y, this.target.x, this.target.y)

                let proj = new FrostBolt(this.level)
                proj.setAngle(angle - 0.4)
                proj.setPoint(this.x, this.y)
    
                this.level.projectiles.push(proj)

                let proj2 = new FrostBolt(this.level)
                proj2.setAngle(angle)
                proj2.setPoint(this.x, this.y)
    
                this.level.projectiles.push(proj2)

                let proj3 = new FrostBolt(this.level)
                proj3.setAngle(angle + 0.4)
                proj3.setPoint(this.x, this.y)
    
                this.level.projectiles.push(proj3)
            }
            else if(this.spell_name === 'despair'){

                let ppl = this.level.players.filter(elem => Func.distance(elem, this) <= 20)

                ppl.forEach(elem => {
                    let status = new Despair(elem.level.time)
                    status.setDuration(6000)
                    this.level.setStatus(elem, status)
                })
                
            }       
        }
    }

     setDyingAct(){
        if(this.freezed){
            this.state = 'freeze_dying'
            this.is_corpse = true
            this.level.sounds.push({
                name: 'shatter',
                x: this.x,
                y: this.y
            })
        }
        else{
            this.state = this.dead_type ? this.dead_type : 'dying'
        }

        this.stateAct = this.DyingAct
        this.invisible = false
        this.setTimerToGetState(this.dying_time)
    }

    setAttackState(){
        this.state = 'attack'
        this.is_attacking = true
        this.stateAct = this.attackAct
        this.action_time = this.cast_speed
        this.invisible = false
        this.setImpactTime(80)

        this.cancelAct = () => {
            this.action = false
            this.hit = false
            this.is_attacking = false
            this.invisible = true
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
            
             if(this.can_cast_despair && Func.distance(this, this.target) <= 10){
                this.spell_name = 'despair'
                this.can_cast_despair = false
                setTimeout(() => {
                    this.can_cast_despair = true
                }, 10000)
            }
            else if(this.can_cast_frost_bolts && Func.distance(this, this.target) <= 30){
                this.spell_name = 'frost bolts'
                this.can_cast_frost_bolts = false
                setTimeout(() => {
                    this.can_cast_frost_bolts = true
                }, 10000)
            }

            setTimeout(() => {
                this.want_to_cast = true
            }, Func.random(3000, 6000))
        }
       
        //todo can cast
        if(this.spell_name){
            this.setState(this.setAttackState)
        }

        else{
            this.setState(this.setRetreatState)
        }
    }
}