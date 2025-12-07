import Func from '../Func'
import Level from '../Level'
import ClosedGate from '../Objects/Effects/ClosedGate'
import Forger from '../Objects/Effects/Forger'
import GraceShard from '../Objects/Effects/GraceShard'
import Teacher from '../Objects/Effects/Teacher'
import Bones from '../Objects/src/Enemy/Bones'
import { Flamy } from '../Objects/src/Enemy/Flamy'
import FlyingBones from '../Objects/src/Enemy/FlyingBones'
import Gifter from '../Objects/src/Enemy/Gifter'
import Impy from '../Objects/src/Enemy/Impy'
import Solid from '../Objects/src/Enemy/Solid'
import Specter from '../Objects/src/Enemy/Specter'
import PileOfDead from '../Objects/src/Piles/PileOfDead'
import PileOfEvil from '../Objects/src/Piles/PileOfEvil'
import PileOfFrost from '../Objects/src/Piles/PileOfFrost'
import PileOfStorm from '../Objects/src/Piles/PileOfStorm'
import PileOfSummoning from '../Objects/src/Piles/PileOfSummoning'
import PileOfVeil from '../Objects/src/Piles/PileOfVeil'
import BannerOfArmour from '../Status/BannerOfArmour'
import Bleed from '../Status/Bleed'
import Blind from '../Status/Blind'
import Curse from '../Status/Curse'
import Drained from '../Status/Drained'
import Fragility from '../Status/Fragility'
import GhostGrip from '../Status/GhostGrip'
import Grace from '../Status/Grace'
import Immortality from '../Status/Immortality'
import Phase from '../Status/Phase'
import Poison from '../Status/Poison'
import Precision from '../Status/Precision'
import ShockStatus from '../Status/ShockStatus'
import Touch from '../Status/Touch'
import Weakness from '../Status/Weakness'
import BossFight from './BossFight'
import Scenario from './Scenario'
import Portal from '../Objects/Effects/Grace'
import ChargedSphere from '../Objects/Effects/ChargedSphere'
import Split from '../Objects/Effects/Split'
import Armour from '../Objects/Effects/Armour'

export default class Learning extends Scenario {
    last_checked: number
    time_between_wave_ms: number
    waves_created: number = 0

    constructor() {
        super()
        this.last_checked = 0
        this.time_between_wave_ms = 4000
    }

    start(level: Level) {
        level.players.forEach(elem => {
            elem.grace = 1110
            elem.gold = 10002
            elem.life_status = 4222
            elem.light_r = 18
        })

        let portal = new Portal(level)
        portal.act = () => {}
        portal.setPoint(70, 20)
        level.binded_effects.push(portal)

        let teacher = new Teacher(level)
        teacher.zone_id = 0
        teacher.setPoint(55, 20)
        level.binded_effects.push(teacher)

        let forger = new Forger(level)
        forger.zone_id = 0
        forger.setPoint(40, 20)
        level.binded_effects.push(forger)

        // let impy = new Impy(level)
        // impy.setPoint(70, 40)
        // impy.life_status = 1000

        // impy.idleAct = () => {

        // }

        // function curse(unit: any = undefined, options: any = {}){
        //     if(!this.curse_num){
        //         this.curse_num = 1
        //     }
        //     this.level.players.forEach(elem => {
        //         let d = 10000
        //         let s = undefined

        //         if(this.curse_num === 1){
        //             s = new Weakness(level.time)
        //         }
        //         else if(this.curse_num === 2){
        //             s = new Poison(level.time)
        //         }
        //         else if(this.curse_num === 3){
        //             s = new Curse(level.time)
        //         }
        //         else if(this.curse_num === 4){
        //             s = new Drained(level.time)
        //         }
        //         else if(this.curse_num === 5){
        //             s = new Bleed(level.time)
        //         }
        //         else if(this.curse_num === 6){
        //             s = new GhostGrip(level.time)
        //         }
        //         else if(this.curse_num === 7){
        //             s = new Blind(level.time)
        //         }
        //         else if(this.curse_num === 8){
        //             s = new ShockStatus(level.time)
        //         }
        //         else if(this.curse_num === 9){
        //             elem.setFreeze(3000)
        //         }
        //         else if(this.curse_num === 10){
        //             s = new Fragility(level.time)
        //         }

        //         if(s != undefined){
        //             s.setDuration(d)
        //             this.level.setStatus(elem, s)
        //         }

        //     })
        //      if(this.curse_num === 10){
        //         this.curse_num = 1
        //     }
        //     else{
        //         this.curse_num ++
        //     }

        //     if(this.is_dead) return

        //     if(options?.instant_death){
        //         unit?.succesefulKill()
        //         this.is_dead = true
        //         this.setdyingAct()
        //         return
        //     }

        //     if(this.checkArmour(unit)){

        //         this.level.addSound({
        //             name: 'metal hit',
        //             x: this.x,
        //             y: this.y
        //         })

        //         let e = new Armour(this.level)
        //         e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
        //         e.z = Func.random(2, 8)
        //         this.level.effects.push(e)
        //         return
        //     }

        //     let damage_value = 1

        //     if(options?.damage_value){
        //         damage_value = options.damage_value
        //     }

        //     if(unit && unit?.critical && Func.chance(unit.critical)){
        //         damage_value *= 2
        //     }

        //     if(this.fragility){
        //         damage_value *= 2
        //     }

        //     this.life_status -= damage_value

        //     if(unit){
        //         unit?.succesefulHit(this)
        //     }

        //     if(this.life_status <= 0){
        //         if(options?.explode){
        //             this.dead_type = 'explode'
        //             this.is_corpse = true
        //             this.level.addSound(this.getExplodedSound())
        //         }
        //         else if(options?.burn){
        //             this.dead_type = 'burn_dying'
        //             this.is_corpse = true
        //         }

        //         this.is_dead = true
        //         this.create_grace_chance += unit?.chance_to_create_grace ? unit?.chance_to_create_grace : 0
        //         unit?.succesefulKill()
        //         //todo
        //         unit?.addGold(this.gold_revard)

        //         this.setdyingAct()
        //     }
        // }

        function buff(unit: any = undefined, options: any = {}) {
            // this.super.takeDamage(unit, options)

            if (unit) {
                unit?.succesefulHit()
            }

            if (this.life_status <= 0 && unit?.blessed) {
                this.ressurect_chance = Math.round(this.ressurect_chance / 2)
            }

            if (!this.curse_num) {
                this.curse_num = 1
            }
            this.level.players.forEach(elem => {
                let d = 10000
                let s = undefined

                if (this.curse_num === 1) {
                    s = new Grace(level.time)
                } else if (this.curse_num === 2) {
                    s = new Precision(level.time)
                } else if (this.curse_num === 3) {
                    s = new Phase(level.time)
                } else if (this.curse_num === 4) {
                    s = new Immortality(level.time)
                } else if (this.curse_num === 5) {
                    s = new Touch(level.time)
                }

                if (s != undefined) {
                    s.setDuration(10000)
                    this.level.setStatus(elem, s)
                }
            })
            if (this.curse_num === 5) {
                this.curse_num = 1
            } else {
                this.curse_num++
            }
        }

        // impy.takeDamage = curse

        // level.enemies.push(impy)

        // let bones = new Bones(level)
        // bones.life_status = 1000
        // bones.setPoint(55, 40)
        // bones.idleAct = () => {

        // }

        // bones.takeDamage = buff

        // level.enemies.push(bones)

        setInterval(() => {
            let shard = level.binded_effects.find(elem => elem.name === 'grace shard')
            if (!shard) {
                shard = new GraceShard(level)
                shard.setPoint(70, 60)

                level.binded_effects.push(shard)
            }

            let sphere = level.binded_effects.find(elem => elem.name === 'charged sphere')
            if (!sphere) {
                sphere = new ChargedSphere(level)
                sphere.setPoint(55, 60)

                level.binded_effects.push(sphere)
            }

            let entity = level.binded_effects.find(elem => elem.name === 'split')
            if (!entity) {
                entity = new Split(level)
                entity.setPoint(40, 60)

                level.binded_effects.push(entity)
            }
        }, 2000)
    }

    checkTime(level: Level) {}
}
