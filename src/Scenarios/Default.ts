import EffectBuilder from '../Classes/EffectBuiler'
import Func from '../Func'
import Level from '../Level'
import CallOfPower from '../Objects/Effects/CallOfPower'
import CircleOfCalm from '../Objects/Effects/CircleOfCalm'
import ClosedGate from '../Objects/Effects/ClosedGate'
import Grace from '../Objects/Effects/Grace'
import UltimatumText from '../Objects/Effects/UltimatumText'
import UltimatumText2 from '../Objects/Effects/UltimatumText2'
import UltimatumText3 from '../Objects/Effects/UltimatumText3'
import UltimatumText4 from '../Objects/Effects/UltimatumText4'
import Character from '../Objects/src/Character'
import Ancient from '../Objects/src/Enemy/Ancient'
import { AscentManifistation } from '../Objects/src/Enemy/AscentManifistation'
import BindedRocks from '../Objects/src/Enemy/BindedRocks'
import Bones from '../Objects/src/Enemy/Bones'
import ConstactedOne from '../Objects/src/Enemy/ConstactedOne'
import Enemy from '../Objects/src/Enemy/Enemy'
import { Flamy } from '../Objects/src/Enemy/Flamy'
import { FleshManifistation } from '../Objects/src/Enemy/FleshManifistation'
import FlyingBones from '../Objects/src/Enemy/FlyingBones'
import { ForgeManifistation } from '../Objects/src/Enemy/ForgeManifistation'
import Ghost from '../Objects/src/Enemy/Ghost'
import Gifter from '../Objects/src/Enemy/Gifter'
import Impy from '../Objects/src/Enemy/Impy'
import MagicSlime from '../Objects/src/Enemy/MagicSlime'
import { MasterManifestation } from '../Objects/src/Enemy/MasterManifestation'
import { MasteryManifistation } from '../Objects/src/Enemy/MasteryManifistation'
import Plague from '../Objects/src/Enemy/Plague'
import Slime from '../Objects/src/Enemy/Slime'
import Solid from '../Objects/src/Enemy/Solid'
import Specter from '../Objects/src/Enemy/Specter'
import Pile from '../Objects/src/Piles/Pile'
import BannerOfArmour from '../Status/BannerOfArmour'
import Bless from '../Status/Bless'
import ElementalEnchanted from '../Status/ElementalEnchanted'
import Reanimator from '../Status/Reanimator'
import SorceryHalo from '../Status/SorceryHalo'
import UnholyPower from '../Status/UnholyPower'
import UnholySpirit from '../Status/UnholySpirit'
import BossFight from './BossFight'
import Scenario from './Scenario'

export default class Default extends Scenario {
    static TIMES_NORMAL = 0
    static TIMES_GOOD = 1
    static TIMES_BAD = 2

    last_checked: number
    time_between_wave_ms: number = 3500
    max_time_wave: number = 6000
    min_time_wave: number = 4000
    waves_created: number = 0
    times_count: number = 0
    add_e_life: number = 0
    add_e_armour: number = 0
    add_e_pierce: number = 0
    add_e_speed: number = 0
    add_attack_speed: number = 0
    add_cooldown_attack: number = 0
    add_critical: number = 0
    add_e_fortify: number = 0
    add_e_elem_resist: number = 0
    minus_create_chance = 0
    wave_boss_trashold: number = 150

    monster_upgrades: any
    private need_to_check_grace: boolean = true
    grace_trashold: number = 15
    times: number
    portal_is_exist = false

    waves_plato: number = 100
    waves_plato_end: number = 140
    waves_end: number = 150

    time_increment: number = 0
    time_decrement: number = 0

    constructor() {
        super()
        this.last_checked = 0
        this.times = Default.TIMES_NORMAL
        this.monster_upgrades = {
            minor: {
                cooldown_attack: 0,
                armour: 0,
                pierce: 0,
            },
            major: {
                attack_speed: 0,
                move_speed: 0,
                life: 0,
            },
        }
        this.time_increment = Math.round((this.max_time_wave - this.time_between_wave_ms) / this.waves_plato)
        this.time_decrement = Math.round((this.max_time_wave - this.min_time_wave) / (this.waves_end - this.waves_plato_end))
    }
    setTimes(times: number) {
        this.times_count = Func.random(4, 8)
        this.times = times
    }

    getInfo() {
        return 'waves: ' + this.waves_created
    }

    start(level: Level) {
        this.last_checked = level.time + this.time_between_wave_ms

        let gate = new ClosedGate(level)
        gate.setPoint(90, 20)
        level.binded_effects.push(gate)
        level.players.forEach(elem => {
            elem.invisible = true
            elem.can_be_controlled_by_player = false
        })

        setTimeout(() => {
            level.addSound({
                name: 'door open',
                x: 90,
                y: 20,
            })

            let gate = level.binded_effects[0]
            level.deleted.push(gate.id)
            level.binded_effects = []

            setTimeout(() => {
                level.players.forEach(elem => {
                    elem.invisible = false
                    elem.can_be_controlled_by_player = true
                })
            }, 400)
        }, 2000)
    }

    checkTime(level: Level) {
        let player_in_zone = level.players.some(elem => elem.zone_id === 0)
        if (!player_in_zone) return

        if (this.waves_created >= this.wave_boss_trashold) {
            this.wave_boss_trashold = Math.round(this.wave_boss_trashold * 1.6)
            level.previuos_script = this
            level.setScript(new BossFight())
            return
        }
        let wave_time = this.time_between_wave_ms

        if (this.times === Default.TIMES_BAD) {
            wave_time = 4000
        } else if (this.times === Default.TIMES_GOOD) {
            wave_time = 12000
        }

        if (level.time - this.last_checked >= wave_time) {
            this.last_checked = level.time

            this.createWave(level)
            this.checkPortal(level)
            this.checkUpgrade(level)

            if (this.times_count) {
                this.times_count --
                if (this.times_count <= 0) {
                    this.times = Default.TIMES_NORMAL
                }
            }
        }
    }

    async createWave(level: Level) {
        this.waves_created ++
        console.log('--------------------')
      
        let add_count = Math.floor(this.waves_created / 23)
        add_count += (level.players.length - 1) * 2

        let count = Func.random(1 + Math.floor(add_count / 4.7), 2 + Math.floor(add_count / 3.2))

        // if (this.times === Default.TIMES_BAD) {
        //     count = Math.round(count * 1.5)
        // }

        // console.log('enemies spawned: ' + count)
        for (let i = 0; i < count; i++) {
            await Func.sleep(Func.random(100, 300))

            this.createRandomEnemy(level)
        }

        this.updateTimeBetweenWaves()
    }

    updateTimeBetweenWaves(){
        if(this.waves_created >= this.waves_plato){
            if(this.waves_created >= 150 && this.max_time_wave >= 4000){
                this.max_time_wave -= 30
                
            }
            
            this.time_between_wave_ms = this.max_time_wave
        }
        else{
            this.time_between_wave_ms += this.time_increment

            if(this.time_between_wave_ms > this.max_time_wave){
                this.time_between_wave_ms =  this.max_time_wave
            }
            
        }

        // console.log('waving rate: ' + this.time_between_wave_ms)
    }

    createRandomEnemy(level: Level, list: string[] = []) {
        let enemy_name = undefined

        let enemy_list = []

        if (list.length) {
            enemy_list = Level.enemy_list.filter(elem => list.includes(elem.name))
        } else {
            enemy_list = Level.enemy_list.filter(elem => !elem.wave || (elem.wave <= this.waves_created))
        }

        let w = Math.random() * enemy_list.reduce((acc, elem) => acc + elem.weight, 0)
        let w2 = 0

        for (let item of enemy_list) {
            w2 += item.weight
            if (w <= w2) {
                enemy_name = item.name
                break
            }
        }

        if (enemy_name === undefined) {
            return
        }

        let enemy = undefined

        if (enemy_name === 'solid') {
            enemy = new Solid(level)
        } else if (enemy_name === 'flying bones') {
            enemy = new FlyingBones(level)
        } else if (enemy_name === 'bones') {
            enemy = new Bones(level)
        } else if (enemy_name === 'flamy') {
            enemy = new Flamy(level)
        } else if (enemy_name === 'specter') {
            enemy = new Specter(level)
        } else if (enemy_name === 'impy') {
            enemy = new Impy(level)
        } else if (enemy_name === 'gifter') {
            enemy = new Gifter(level, this.waves_created)
        } else if (enemy_name === 'ghost') {
            enemy = new Ghost(level)
        } else if (enemy_name === 'slime') {
            enemy = new Slime(level)
        } else if (enemy_name === 'magic slime') {
            enemy = new MagicSlime(level)
        } else if (enemy_name === 'pile') {
            enemy = new Pile(level)
        } else if (enemy_name === 'plague') {
            enemy = new Plague(level)
        } else if (enemy_name === 'binded rocks') {
            enemy = new BindedRocks(level)
        }
        

        if (!enemy) {
            return
        }

        while (enemy.isOutOfMap()) {
            let players_in_zone = level.players.filter(elem => elem.zone_id === 0)
            let random_player = players_in_zone[Math.floor(Math.random() * players_in_zone.length)]
            if (!random_player) {
                return
            }
            let angle = Math.random() * 6.28
            let distance_x = Func.random(14, 30)
            let distance_y = Func.random(14, 30)

            enemy.setPoint(
                random_player.x + Math.sin(angle) * distance_x,
                random_player.y + Math.cos(angle) * distance_y
            )
        }

        let elite_chance = 4 + Math.floor(this.waves_created / 8)

        if (this.times === Default.TIMES_GOOD) {
            enemy.create_chance += 15
        }

        if (
            Func.chance(elite_chance) &&
            (enemy instanceof Solid || enemy instanceof FlyingBones || enemy instanceof Specter || enemy instanceof Plague || enemy instanceof BindedRocks)
        ) {
            enemy = this.createElite(enemy, level)
        }

        enemy.upgradeByWave(this.waves_created)

        // enemy = this.upgradeEnemy(enemy)

        level.enemies.push(enemy)
    }

    createElite(enemy: Enemy, level: Level) {
        let r = Func.random(1, 7)

        if (r === 1) {
            let status = new BannerOfArmour(level.time)
            level.setStatus(enemy, status)
        } else if (r === 2) {
            let status = new ElementalEnchanted(level.time)
            level.setStatus(enemy, status)
        } else if (r === 3) {
            let status = new UnholyPower(level.time)
            level.setStatus(enemy, status)
        } else if (r === 4) {
            let status = new UnholySpirit(level.time)
            level.setStatus(enemy, status)
        } else if (r === 5) {
            let status = new Bless(level.time)
            level.setStatus(enemy, status)
        } else if (r === 6) {
            let status = new SorceryHalo(level.time)
            level.setStatus(enemy, status)
        } else if (r === 7) {
            let status = new Reanimator(level.time)
            level.setStatus(enemy, status)
        }

        enemy.can_be_instant_killed = false

        return enemy
    }

    upgradeEnemy(enemy: Enemy) {
        enemy.life_status += this.add_e_life
        enemy.armour_rate += this.add_e_armour
        enemy.pierce += this.add_e_pierce
        enemy.move_speed_penalty += this.add_e_speed
        enemy.attack_speed -= this.add_attack_speed
       
        if(enemy.create_chance <= 20){
            enemy.create_chance -= this.minus_create_chance
        }
        else{
            enemy.create_chance -= (this.minus_create_chance * 2)
        }

        enemy.fortify += this.add_e_fortify
        enemy.critical += this.add_critical

        // if (enemy.create_chance <= 0) {
        //     enemy.create_chance = 0
        // }

        if (enemy.attack_speed < 150) {
            enemy.attack_speed = 150
        }

        enemy.cooldown_attack -= this.add_cooldown_attack

        if (enemy.cooldown_attack < 0) {
            enemy.cooldown_attack = 0
        }

        enemy.elemental_status_resist += this.add_e_elem_resist

        return enemy
    }

    setGraceTrashold() {
        let add = 0

        if (this.waves_created < 45) {
            add = Func.random(10, 15)
        } else if (this.waves_created < 100) {
            add = Func.random(15, 25)
        } else if (this.waves_created < 200) {
            add = Func.random(25, 35)
        } else {
            add = Func.random(35, 45)
        }

        this.grace_trashold += add
    }

    checkPortal(level) {
        if (!this.need_to_check_grace) return

        this.portal_is_exist = level.binded_effects.some(elem => elem instanceof Grace)

        if (this.portal_is_exist) {
            this.grace_trashold++
            return
        }

        let chance = this.waves_created - this.grace_trashold

        if (chance > 0) {
            this.setGraceTrashold()
            let portal: Grace = new Grace(level)
            while (portal.isOutOfMap()) {
                let random_player: Character =
                    level.players[Math.floor(Math.random() * level.players.length)]
                let angle: number = Math.random() * 6.28
                let distance_x: number = Func.random(15, 28)
                let distance_y: number = Func.random(15, 28)

                portal.setPoint(
                    random_player.x + Math.sin(angle) * distance_x,
                    random_player.y + Math.cos(angle) * distance_y
                )
            }

            level.binded_effects.push(portal)
        }
    }

    checkUpgrade(level) {
        let players: Character = level.players.filter(elem => elem.zone_id === 0)
        
        if(this.waves_created >= 1 && this.waves_created % 14 === 0){
            
            let a = Math.random() > 0.5 ? new CircleOfCalm(level) : new CallOfPower(level)
            let random = Func.getRandomFromArray(players)

            let angle: number = Math.random() * 6.28
            let distance_x: number = Func.random(12, 17)
            let distance_y: number = Func.random(12, 17)

            a.setPoint(
                random.x + Math.sin(angle) * distance_x,
                random.y + Math.cos(angle) * distance_y
            )

            level.binded_effects.push(a)
        }
        if (this.waves_created > 1 && this.waves_created % 25 === 0) {
            let a = Math.random() > 0.5 ? new Ancient(level) : new ConstactedOne(level)
            let random = Func.getRandomFromArray(players)

            let angle: number = Math.random() * 6.28
            let distance_x: number = Func.random(12, 17)
            let distance_y: number = Func.random(12, 17)

            a.setPoint(
                random.x + Math.sin(angle) * distance_x,
                random.y + Math.cos(angle) * distance_y
            )

            level.enemies.push(a)
        }
        if (this.waves_created % 10 === 0 && this.waves_created > 1) {
            let e = undefined
            let r = Func.random(1, 5)

            if (r === 1) {
                e = new MasterManifestation(level)
            } else if (r === 2) {
                e = new FleshManifistation(level)
            } else if (r === 3) {
                e = new ForgeManifistation(level)
            } else if (r === 4) {
                e = new AscentManifistation(level)
            } else {
                e = new MasteryManifistation(level)
            }

            while (e.isOutOfMap()) {
                let random = Func.getRandomFromArray(players)

                if (random) {
                    let angle: number = Math.random() * 6.28
                    let distance_x: number = Func.random(15, 20)
                    let distance_y: number = Func.random(15, 20)

                    e.setPoint(
                        random.x + Math.sin(angle) * distance_x,
                        random.y + Math.cos(angle) * distance_y
                    )
                } else {
                    e.setPoint(60, 60)
                }
            }

            EffectBuilder.createGroup(e)
            level.binded_effects.push(e)
        }

        if (this.waves_created % 18 === 0 && this.waves_created > 1) {
            let e = undefined
            let r = Func.random(1, 4)

            if (r === 1) {
                e = new UltimatumText(level)
            } else if (r === 2) {
                e = new UltimatumText2(level)
            } else if (r === 3) {
                e = new UltimatumText3(level)
            } else {
                e = new UltimatumText4(level)
            }

            while (e.isOutOfMap()) {
                let random = Func.getRandomFromArray(players)

                if (random) {
                    let angle: number = Math.random() * 6.28
                    let distance_x: number = Func.random(15, 25)
                    let distance_y: number = Func.random(15, 25)

                    e.setPoint(
                        random.x + Math.sin(angle) * distance_x,
                        random.y + Math.cos(angle) * distance_y
                    )
                } else {
                    e.setPoint(60, 60)
                }
            }

            EffectBuilder.createGroup(e)
            level.binded_effects.push(e)
        }

        // if (this.waves_created % 9 === 0) {
        //     let min = undefined
        //     let name = undefined
        //     for (let minor in this.monster_upgrades.minor) {
        //         if (min === undefined || this.monster_upgrades.minor[minor] < min) {
        //             min = this.monster_upgrades.minor[minor]
        //             name = minor
        //         }
        //     }
        //     if (!name) return

        //     this.monster_upgrades.minor[name]++

        //     switch (name) {
        //         case 'cooldown_attack':
        //             this.add_cooldown_attack += 50
        //             break
        //         case 'pierce':
        //             this.add_e_pierce += 5
        //             break
        //         case 'armour':
        //             this.add_e_armour += 5
        //             break
        //     }
        // }
        // if (this.waves_created % 19 === 0) {
        //     let min = undefined
        //     let name = undefined
        //     for (let major in this.monster_upgrades.major) {
        //         if (min === undefined || this.monster_upgrades.major[major] < min) {
        //             min = this.monster_upgrades.major[major]
        //             name = major
        //         }
        //     }
        //     if (!name) return

        //     this.monster_upgrades.major[name]++

        //     switch (name) {
        //         case 'attack_speed':
        //             this.add_attack_speed += 50
        //             this.add_critical += 6
        //             break
        //         case 'move_speed':
        //             this.add_e_speed += 6
        //             this.minus_create_chance += 4
        //             break
        //         case 'life':
        //             this.add_e_life += 1
        //             this.add_e_fortify += 5
        //             if (this.add_e_elem_resist < 60) {
        //                 this.add_e_elem_resist += 15
        //             }
        //             break
        //     }

        //     level.addSound('evel upgrade', 40, 40)
        // }
    }
}