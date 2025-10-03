import Func from "../Func";
import Pierce from "../Items/Forgings/Pierce";
import Level from "../Level";
import Armour from "../Objects/Effects/Armour";
import ClosedGate from "../Objects/Effects/ClosedGate";
import Grace from "../Objects/Effects/Grace";
import Character from "../Objects/src/Character";
import Bones from "../Objects/src/Enemy/Bones";
import { Enemy } from "../Objects/src/Enemy/Enemy";
import { Flamy } from "../Objects/src/Enemy/Flamy";
import FlyingBones from "../Objects/src/Enemy/FlyingBones";
import Ghost from "../Objects/src/Enemy/Ghost";
import Gifter from "../Objects/src/Enemy/Gifter";
import Impy from "../Objects/src/Enemy/Impy";
import MagicSlime from "../Objects/src/Enemy/MagicSlime";
import Slime from "../Objects/src/Enemy/Slime";
import Solid from "../Objects/src/Enemy/Solid";
import Specter from "../Objects/src/Enemy/Specter";
import PileOfDead from "../Objects/src/Piles/PileOfDead";
import PileOfEvil from "../Objects/src/Piles/PileOfEvil";
import PileOfFrost from "../Objects/src/Piles/PileOfFrost";
import PileOfStorm from "../Objects/src/Piles/PileOfStorm";
import PileOfSummoning from "../Objects/src/Piles/PileOfSummoning";
import PileOfVeil from "../Objects/src/Piles/PileOfVeil";
import BannerOfArmour from "../Status/BannerOfArmour";
import Bless from "../Status/Bless";
import ElementalEnchanted from "../Status/ElementalEnchanted";
import UnholyPower from "../Status/UnholyPower";
import UnholySpirit from "../Status/UnholySpirit";
import BossFight from "./BossFight";
import Scenario from "./Scenario";

export default class Default extends Scenario{ 

    last_checked: number
    time_between_wave_ms: number
    waves_created: number = 0
    add_e_life: number = 0
    add_e_armour: number = 0
    add_e_pierce: number = 0
    add_e_speed: number = 0
    add_attack_speed: number = 0
    add_cooldown_attack: number = 0
    monster_upgrades: any
    private need_to_check_grace: boolean = true
    grace_trashold: number = 10

    constructor(){
        super()
        this.last_checked = 0
        this.time_between_wave_ms = 4500
        this.monster_upgrades = {
            minor:{
                cooldown_attack: 0,
                armour: 0,
                pierce: 0,
            },
            major:{
                attack_speed: 0,
                life: 0,
                move_speed: 0
            }
        }
    }

    start(level: Level){
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
                y: 20
            })

            let gate = level.binded_effects[0]
            level.deleted.push(gate.id)
            level.binded_effects = []

            setTimeout(() => {
                level.players.forEach(elem => {
                    elem.invisible = false
                    elem.can_be_controlled_by_player = true
                })
            },400)
        }, 2000)
    }

    checkTime(level: Level){
        if(level.kill_count >= level.boss_kills_trashold){
            level.previuos_script = this
            level.setScript(new BossFight())
            return
        }
        if(level.time - this.last_checked >= this.time_between_wave_ms){
            this.last_checked = level.time
           
            this.createWave(level)
            
            if(this.time_between_wave_ms < 10000){
                this.time_between_wave_ms += 40
            }
        }
    }

    createWave(level: Level){
        let player_in_zone = level.players.some(elem =>  elem.zone_id === 0)
        if(!player_in_zone) return

        this.waves_created ++

        let add_count = Math.floor(this.waves_created / 15)

        let count = Func.random(1 + Math.floor(add_count / 2), 2 + Math.floor(add_count))
        
        count += (level.players.length - 1)


        for(let i = 0; i < count; i++){

            let enemy_name = undefined

            let w = Math.random() * Level.enemy_list.reduce((acc, elem) => acc + elem.weight, 0)
            let w2 = 0;
            
            for (let item of Level.enemy_list) {
                w2 += item.weight;
                if (w <= w2) {
                    enemy_name = item.name;
                    break;
                }
            }

            if(enemy_name === undefined){
                continue
            }

            let enemy = undefined

            if(enemy_name === 'solid'){
                enemy = new Solid(level)
            }
            else if(enemy_name === 'flying bones'){
                enemy = new FlyingBones(level)
            }
            else if(enemy_name === 'bones'){
                enemy = new Bones(level)
            }
            else if(enemy_name === 'flamy'){
                enemy = new Flamy(level)
            }
            else if(enemy_name === 'specter'){
                enemy = new Specter(level)
            }
            else if(enemy_name === 'impy'){
                enemy = new Impy(level)
            }
            else if(enemy_name === 'gifter'){
                enemy = new Gifter(level)
            }
            else if(enemy_name === 'ghost'){
                enemy = new Ghost(level)
            }
            else if(enemy_name === 'slime'){
                enemy = new Slime(level)
            }
             else if(enemy_name === 'magic slime'){
                enemy = new MagicSlime(level)
            }
            else if(enemy_name === 'pile'){
                let variants = ['evil', 'frost', 'blind', 'shock', 'summon', 'dead']
                let name = variants[Math.floor(Math.random() * variants.length)]

                switch(name){
                    case 'evil':
                        enemy = new PileOfEvil(level)
                        break;
                    case 'frost':
                        enemy = new PileOfFrost(level)
                        break;
                    case 'blind':
                        enemy = new PileOfVeil(level)
                        break;
                    case 'shock':
                        enemy =  new PileOfStorm(level)
                        break;
                    case 'summon':
                        enemy =  new PileOfSummoning(level)
                        break;
                    case 'dead':
                        enemy =  new PileOfDead(level)
                        break;
                }
            }

            if(!enemy){
                continue
            }

            while(enemy.isOutOfMap()){
                let players_in_zone = level.players.filter(elem => elem.zone_id === 0)
                let random_player = players_in_zone[Math.floor(Math.random() * players_in_zone.length)]

                let angle = Math.random() * 6.28
                let distance_x = Func.random(14, 30)
                let distance_y = Func.random(14, 30)

                enemy.setPoint(random_player.x + Math.sin(angle) * distance_x, random_player.y + Math.cos(angle) * distance_y)
            }

            if(Func.chance(5) && (enemy instanceof Solid) || (enemy instanceof FlyingBones) || (enemy instanceof Specter)){
                let r = Func.random(1, 5)

                if(r === 1){
                    let status = new BannerOfArmour(level.time)
                    level.setStatus(enemy, status)
                }
                else if(r === 2){
                    let status = new ElementalEnchanted(level.time)
                    level.setStatus(enemy, status)
                }
                else if(r === 3){
                    let status = new UnholyPower(level.time)
                    level.setStatus(enemy, status)
                }
                else if(r === 4){
                    let status = new UnholySpirit(level.time)
                    level.setStatus(enemy, status)
                }
                else if(r === 5){
                    let status = new Bless(level.time)
                    level.setStatus(enemy, status)
                }
            }

            enemy.life_status += this.add_e_life
            enemy.armour_rate += this.add_e_armour
            enemy.pierce += this.add_e_pierce
            enemy.move_speed += this.add_e_speed
            enemy.attack_speed -= this.add_attack_speed

            if(enemy.attack_speed < 200){
                enemy.attack_speed = 200
            }

            enemy.cooldown_attack -= this.add_cooldown_attack

            if(enemy.cooldown_attack < 0){
                enemy.cooldown_attack = 0
            }
            
            level.enemies.push(enemy) 
        }

    
        this.checkUpgrade(level)
        this.checkPortal(level) 
    }

    checkPortal(level){
        if(!this.need_to_check_grace) return

        let exist: boolean = level.binded_effects.some(elem => elem instanceof Grace)

        if(exist){
            return
        }

        if(this.waves_created < this.grace_trashold) return

        let delta = this.waves_created - this.grace_trashold

        let chance = 20 + delta * 3

        if(Func.chance(chance)){
            this.grace_trashold += 20 + Math.floor(this.waves_created / 10)
            let portal: Grace = new Grace(level)
            while(portal.isOutOfMap()){
                let random_player: Character = level.players[Math.floor(Math.random() * level.players.length)]
                let angle: number = Math.random() * 6.28
                let distance_x: number = Func.random(15, 28)
                let distance_y: number = Func.random(15, 28)

                portal.setPoint(random_player.x + Math.sin(angle) * distance_x, random_player.y + Math.cos(angle) * distance_y)
            }

            level.binded_effects.push(portal)
        }
    }

    checkUpgrade(level){
        if(this.waves_created % 12 === 0){
            let min = undefined
            let name = undefined
            for(let minor in this.monster_upgrades.minor){
                if(min === undefined || this.monster_upgrades.minor[minor] < min){
                    min = this.monster_upgrades.minor[minor]
                    name = minor
                }
            }
            if(!name) return

            this.monster_upgrades.minor[name] ++

            switch(name){
                case 'cooldown_attack':
                    this.add_cooldown_attack += 50
                    break;
                case 'pierce':
                    this.add_e_pierce += 3
                    break;
                case 'armour':
                    this.add_e_armour += 3
                    break;
            }
        }
        if(this.waves_created % 25 === 0){
            let min = undefined
            let name = undefined
            for(let major in this.monster_upgrades.major){
                if(min === undefined || this.monster_upgrades.major[major] < min){
                    min = this.monster_upgrades.major[major]
                    name = major
                }
            }
            if(!name) return

            this.monster_upgrades.major[name] ++

            switch(name){
                case 'life':
                    this.add_e_life += 1
                    break;
                case 'move_speed':
                    this.add_e_speed += 0.1
                    break;
                case 'attack_speed':
                    this.add_attack_speed += 50
                    break;
            }

            level.addSound('evel upgrade', 40, 40)
        }
    }
}