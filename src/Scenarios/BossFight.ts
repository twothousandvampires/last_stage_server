import Func from "../Func";
import Level from "../Level";
import CureseOfDamnedArea from "../Objects/Effects/CureseOfDamnedArea";
import Boss from "../Objects/src/Bosses/Boss";
import Bones from "../Objects/src/Enemy/Bones";
import { Flamy } from "../Objects/src/Enemy/Flamy";
import FlyingBones from "../Objects/src/Enemy/FlyingBones";
import Impy from "../Objects/src/Enemy/Impy";
import Solid from "../Objects/src/Enemy/Solid";
import Specter from "../Objects/src/Enemy/Specter";
import Statue from "../Objects/src/Enemy/Statue";
import Madness from "../Status/Madness";
import Scenario from "./Scenario";

export default class BossFight extends Scenario{
    constructor(){
        super()
        this.map = [{
            time: 2000,
            action: (level: Level) => {
                level.enemies.forEach((elem) => {
                    elem.armour_rate = 0
                    elem.life_status = 1
                    elem.create_chance = 0

                    let r = Func.random(1, 3)

                    if(r === 1){
                        elem.takeDamage(undefined, {
                            burn: true
                        })
                    }
                    else if(r === 2 && !(elem instanceof Bones) && !(elem instanceof FlyingBones)){
                        elem.takeDamage(undefined, {
                            explode: true
                        })
                    }
                    else if(r === 3){
                        elem.setFreeze(1000)
                        elem.takeDamage(undefined)
                    }
                    else{
                        elem.setFreeze(1000)
                        elem.takeDamage(undefined)
                    }
                })

                level.enemies.forEach((elem) => {
                    elem.armour_rate = 0
                    elem.life_status = 1
                    elem.create_chance = 0

                    elem.takeDamage(undefined)
                })

                //todo return this method
                level.checkGraceCreating = () => {}
            }
        },
        {
            time: 4000,
            action: (level: Level) => {
                level.players.forEach(elem => {
                    elem.can_move_by_player = false
                    let effect = new CureseOfDamnedArea(level)
                    effect.x = elem.x
                    effect.y = elem.y

                    level.effects.push(effect)
                })
            }
        },
        {
            time: 7000,
            action: (level: Level) => {
                level.players.forEach((elem, index) => {
                    elem.x = 60 + index * 2
                    elem.y = 60 + index * 2
                })
            }
        },
        {
            time: 7500,
            action: (level: Level) => {
                level.players.forEach((elem, index) => {
    
                    let effect = new CureseOfDamnedArea(level)
                    effect.x = elem.x
                    effect.y = elem.y

                    level.effects.push(effect)
                })
            }
        },
        {
            time: 9000,
            action: (level: Level) => {
                level.players.forEach(elem => {
                    elem.can_move_by_player = true
                })

                let p = level.players[0]

                let x = p.x
                let y = p.y
                let distance = 42
                let count = 20
        
                let zones = 6.28 / count

                for(let i = 1; i <= count; i++){
                    let min_a = (i - 1) * zones
                
                    let angle = min_a
                    let l = 1 - Math.abs(0.5 * Math.cos(angle))

                    let e = new Statue(level)
                    e.x = x + ((Math.sin(angle) * l) * distance)
                    e.y = y + ((Math.cos(angle) * l) * distance)
                    e.look_angle = angle - 3.14
    
                    level.enemies.push(e)
                }
                
            }
        },
            {
                time: 11000,
                action: (level: Level) => {
                    let boss = new Boss(level)
                    let p = level.players[0]

                    boss.setPoint(p.x + 14, p.y)

                    level.enemies.push(boss)
                    
                    let e = new CureseOfDamnedArea(level)

                    e.setPoint(60, 60)

                    setInterval(() => {
                        level.players.forEach(elem => {
                            if(Func.distance(e, elem) > 40){
                                elem.setPoint(boss.x, boss.y)
                            }
                        })
                    }, 2000)
                }
            },
        ]
    }

    createWave(level: Level){
        let player_in_zone = level.players.some(elem =>  elem.zone_id === 0)
        if(!player_in_zone) return

        let count = 100

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
        
            if(!enemy){
                continue
            }

            while(enemy.isOutOfMap()){
                let players_in_zone = level.players.filter(elem => elem.zone_id === 0)
                let random_player = players_in_zone[Math.floor(Math.random() * players_in_zone.length)]
                let angle = Math.random() * 6.28
                let distance_x = Func.random(15, 80)
                let distance_y = Func.random(15, 80)

                enemy.setPoint(random_player.x + Math.sin(angle) * distance_x, random_player.y + Math.cos(angle) * distance_y)
            }

            level.enemies.push(enemy)
        }       
    }

    start(level: Level): void {
       
    }
}