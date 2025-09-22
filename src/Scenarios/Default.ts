import Func from "../Func";
import Level from "../Level";
import ClosedGate from "../Objects/Effects/ClosedGate";
import Bones from "../Objects/src/Enemy/Bones";
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
import ElementalEnchanted from "../Status/ElementalEnchanted";
import UnholyPower from "../Status/UnholyPower";
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

    constructor(){
        super()
        this.last_checked = 0
        this.time_between_wave_ms = 4500
    }

    start(level: Level){
        this.last_checked = level.time + this.time_between_wave_ms

        let gate = new ClosedGate(level)
        gate.setPoint(90, 20)
        level.binded_effects.push(gate)
        level.players.forEach(elem => {
            elem.invisible = true
            elem.can_move_by_player = false
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
                    elem.can_move_by_player = true
                })
            },400)
        }, 2000)
    }

    checkTime(level: Level){
        if(level.kill_count >= level.boss_kills_trashold){
            level.setScript(new BossFight())
            return
        }
        if(level.time - this.last_checked >= this.time_between_wave_ms){
            this.last_checked = level.time
            this.waves_created ++
            this.createWave(level)
            
            if(this.time_between_wave_ms < 15000 && this.waves_created % 2 === 0){
                this.time_between_wave_ms + 250
            }
        }
    }

    createWave(level: Level){
        let player_in_zone = level.players.some(elem =>  elem.zone_id === 0)
        if(!player_in_zone) return

        let add_count = Math.floor(level.kill_count / 30)

        let count = Func.random(1 + Math.floor(add_count / 3), 2 + Math.floor(add_count / 2))
        
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
                let distance_x = Func.random(10, 30)
                let distance_y = Func.random(10, 30)

                enemy.setPoint(random_player.x + Math.sin(angle) * distance_x, random_player.y + Math.cos(angle) * distance_y)
            }

            if(Func.chance(5) && (enemy instanceof Solid) || (enemy instanceof FlyingBones) || (enemy instanceof Specter)){
                let r = Func.random(1, 3)

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
            }

            enemy.life_status += this.add_e_life
            enemy.armour_rate += this.add_e_armour
            enemy.pierce += this.add_e_pierce
            enemy.move_speed += this.add_e_speed
            
            level.enemies.push(enemy)   
        }

        console.log(this.waves_created)

        if(this.waves_created % 20 === 0){
            this.add_e_armour += 2
            this.add_e_pierce += 2
            console.log('add armour')
        }
        if(this.waves_created % 40 === 0){
            this.add_e_life += 1
            console.log('add life')
        }
        if(this.waves_created % 80 === 0){
            this.add_e_speed += 0.1
            console.log('add speed')
        } 
    }
}