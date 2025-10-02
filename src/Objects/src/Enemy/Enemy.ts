import Func from "../../../Func";
import Level from "../../../Level";
import Armour from "../../Effects/Armour";
import QuakeEffect from "../../Effects/Quake";
import SmallTextLanguage2 from "../../Effects/SmallTextLanguage2";
import Character from "../Character";
import Unit from "../Unit";

export abstract class Enemy extends Unit {

    is_spawning: boolean = true
    target: Character | undefined
    check_timer: any
    player_check_radius = 40
    can_check_player: boolean = true
    dying_time: number = 1200
    spawn_time: number = 1200
    dead_type: string | undefined
    cooldown_attack: number = 2000
    retreat_distance: number = 0
    retreat_angle: number | undefined
    ranged: boolean = false

    create_grace_chance: number = 15
    create_energy_chance: number = 5
    create_entity_chance: number = 5
    create_intervention_chance: number = 2
    create_item_chance: number = 0
    create_sorcerers_skull_chance: number = 0

    create_chance: number = 15
    last_action: number = 0

    count_as_killed: boolean = true
    say_z: number = 12
    gold_revard: number = 1
    can_be_burned: boolean = true
    
    constructor(level: Level){
        super(level)
        this.name = 'enemy'
    }

    abstract idleAct(server_tick: number): void
    abstract attackAct(server_tick: number): void

    setAttackState(){
        this.state = 'attack'
        this.is_attacking = true
        this.stateAct = this.attackAct
        this.action_time = this.attack_speed
        this.setImpactTime(80)
        
        this.attack_angle = Func.angle(this.x, this.y, this.target.x, this.target.y)

        this.cancelAct = () => {
            this.action = false
            this.hit = false
            this.is_attacking = false
            this.attack_angle = undefined
        }

        this.setTimerToGetState(this.attack_speed)
    }

     setRetreatState(){
        if(!this.target) return

        this.state = 'move'
        this.retreat_angle = Func.angle(this.target.x, this.target.y, this.x, this.y)
        this.retreat_angle += Math.random() * 1.57 * (Func.random(50) ? -1 : 1)

        this.stateAct = this.retreatAct

        this.cancelAct = () => {
            this.retreat_angle = undefined
        }

        this.setTimerToGetState(2000)
    }

    checkPlayer(){
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
    }

    getTotalWeights(){
        return [
            ['grace', this.create_grace_chance],
            ['energy', this.create_energy_chance],
            ['entity', this.create_entity_chance],
            ['intervention', this.create_intervention_chance],
            ['item', this.create_item_chance],
            ['skull', this.create_sorcerers_skull_chance], 
        ]
    }

    moveAct(){
        if(this.is_dead) return
        
        this.state = 'move'

        let a = Func.angle(this.x, this.y, this.target.x, this.target.y)

        this.moveByAngle(a)
        this.wasChanged()
    }

    setImpactTime(c: number){
        if(!this.action_time) return

        c += Func.chance(50) ? 5 : -5
        this.action_impact = this.level.time + (this.action_time * (c / 100))
        this.action_end_time =  this.level.time + this.action_time
        this.last_action = this.level.time + this.action_time
    }

    enemyCanAtack(tick: number){
        return tick - this.last_action >= this.cooldown_attack
    }

    retreatAct(){
        let a = this.retreat_angle
      
        if(!a) return
        
        this.moveByAngle(a)
        this.wasChanged()
    }

    act(time: number){
        if(!this.stateAct){
            this.getState()
        }
        
        this.stateAct(time)
       
        if(this.action_impact && time >= this.action_impact){
            if(!this.action){
                this.action = true
            }
            else{
                this.action = false
                this.action_impact = 0
            }
        }
    }

    spawnAct(){
        
    }

    setStunAct(){
        this.stunned = true
        this.state = 'stunned'     

        this.stateAct = this.stunnedAct

        this.cancelAct = () => {
            this.stunned = false
        }
    }

    setStun(duration: number){
        this.setState(this.setStunAct)

        this.setTimerToGetState(duration)
    }

    afterDead(){

    }

    setdyingAct(){
        let to_delete = true
        this.invisible = false

        if(this.freezed){
            this.state = 'freeze_dying'
            this.level.sounds.push({
                name: 'shatter',
                x: this.x,
                y: this.y
            })
        }
        else if(this.burned){
            this.state = 'burn_dying'
        }
        else if(this.exploded){
            this.state = 'explode'
        }
        else{
            this.state = 'dying'
            to_delete = false
        }

        if(to_delete){
            this.level.removeEnemy(this)
        }
        else{
            this.stateAct = this.dyingAct
            this.setTimerToGetState(this.dying_time)
            this.afterDead()
        }
    }

    setIdleAct(){
        this.state = 'idle'
        this.stateAct = this.idleAct
    }

    setDeadState(){
        this.is_corpse = true
        this.state = 'dead'
        this.stateAct = this.deadAct
    }

    getExplodedSound(){
        return {
            name: 'corpse explode',
            x: this.x,
            y: this.y
        }
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
        }
    }
    
    takeDamage(unit: any = undefined, options: any = {}){
        if(this.is_dead) return

        let is_player_deal_hit = unit instanceof Character

        let instantly = options?.instant_death || (unit && unit.chance_to_instant_kill && Func.chance(unit.chance_to_instant_kill))

        if(instantly){
            this.life_status = 1
            this.armour_rate = 0
        }

        if(this.checkArmour(unit)){
            this.level.addSound({
                name: 'metal hit',
                x: this.x,
                y: this.y
            })

            let e = new Armour(this.level)
            e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
            e.z = Func.random(2, 8)
            this.level.effects.push(e)
            return
        }

        let damage_value = 1

        if(options?.damage_value){
           damage_value = options.damage_value
        }

        let is_pierce = unit && unit?.pierce > this.armour_rate && Func.chance(unit.pierce - this.armour_rate)

        if(is_pierce){
            damage_value ++
            if(is_player_deal_hit){
                unit.succesefulPierce(this)
            }
        }

        if(this.penetrated_rating > 0 && Func.chance(this.penetrated_rating)){
            damage_value ++
        }

        if(unit && unit.penetrate > 0){
            this.penetrated_rating += unit.penetrate
        }
       
        if(unit && unit?.critical && Func.chance(unit.critical)){
            damage_value *= 2
            if(is_player_deal_hit){
                unit.succesefulCritical(this)
            }
        }

        if(Func.chance(this.fragility)){
            damage_value *= 2
        }

        this.life_status -= damage_value

        if(is_player_deal_hit){
            unit.succesefulHit(this)
        }

        if(this.life_status <= 0){
            this.is_dead = true

            if(options?.explode){
                this.exploded = true
                this.level.addSound(this.getExplodedSound())
            }
            else if(options?.burn && this.can_be_burned){
                this.burned = true
            }

            if(is_player_deal_hit){
                this.create_grace_chance += unit.chance_to_create_grace
                unit.succesefulKill(this)
                unit.addGold(this.gold_revard)
            }
         
            this.setState(this.setdyingAct)
        }
        
        if(is_player_deal_hit && unit.impact > 0 && unit.level.time - unit.last_impact_time >= unit.impact_cooldown){
            if(Func.chance(unit.impact)){
                unit.last_impact_time = unit.level.time
                let e = new QuakeEffect(this.level)
                e.setPoint(this.x, this.y)

                this.level.effects.push(e)

                this.level.enemies.forEach(elem => {
                    if(Func.distance(this, elem) <= 10 && !elem.is_dead && elem != this){
                        elem.takeDamage(undefined)
                    }
                })
            }
        } 

        this.level.addSound(this.getWeaponHitedSound())
    }

    getWeaponHitedSound(){
        return  {
            name: 'sword hit',
            x:this.x,
            y:this.y
        }
    }

    getState(): void {
        if(this.is_dead){
            this.setState(this.setDeadState)
        }
        else if(this.is_spawning){
            this.setState(this.setSpawsState)
        }
        else{
            this.sayPhrase()
            this.setState(this.setIdleAct)
        }
    }

    setSpawsState(){
        this.state = 'spawn'
        this.stateAct = this.spawnAct
        this.action_time = this.spawn_time
        
        this.cancelAct = () => {
            this.is_spawning = false
        }

        this.setTimerToGetState(this.spawn_time)
    }

    public sayPhrase(): void{
        if(!Func.chance(1)) return

        let phrase = new SmallTextLanguage2(this.level)
        phrase.z = this.say_z
        phrase.setPoint(this.x, this.y)

        this.level.effects.push(phrase)
    }
}