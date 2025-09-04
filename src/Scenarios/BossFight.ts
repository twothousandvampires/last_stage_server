import Func from "../Func";
import Level from "../Level";
import CureseOfDamnedArea from "../Objects/Effects/CureseOfDamnedArea";
import Boss from "../Objects/src/Bosses/Boss";
import Bones from "../Objects/src/Enemy/Bones";
import FlyingBones from "../Objects/src/Enemy/FlyingBones";
import Statue from "../Objects/src/Enemy/Statue";
import Default from "./Default";
import Scenario from "./Scenario";

export default class BossFight extends Scenario {

    check_players_interval: any

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
                level.need_to_check_grace = false
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
                    if(elem.zone_id === 0){
                         elem.x = 60 + index * 2
                         elem.y = 60 + index * 2
                    }
                })
            }
        },
        {
            time: 7500,
            action: (level: Level) => {
                level.players.forEach((elem, index) => {
                    if(elem.zone_id === 0){
                         let effect = new CureseOfDamnedArea(level)
                        effect.x = elem.x
                        effect.y = elem.y

                        level.effects.push(effect)
                    }
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

                    this.check_players_interval = setInterval(() => {
                        level.players.forEach(elem => {
                            if(Func.distance(e, elem) > 40){
                                elem.setPoint(boss.x + 1, boss.y + 1)
                            }
                        })
                    }, 2000)
                }
            },
        ]
    }

    end(level: Level){
        clearInterval(this.check_players_interval)
        this.check_players_interval = undefined

        let statues = level.enemies.filter(elem => elem.name === 'statue')

        statues.forEach(elem => {
            elem.is_corpse = true
            elem.setDyingAct()
        })

        level.need_to_check_grace = true
        level.boss_kills_trashold *= 2.5
        level.setScript(new Default())
    }

    start(level: Level): void {
       
    }
}