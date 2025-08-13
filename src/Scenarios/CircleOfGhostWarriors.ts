import LightningBolt from "../Abilities/Flyer/LightningBolt";
import Level from "../Level";
import LightningBoltEffect from "../Objects/Effects/LightningBoltEffect";
import ToothExplode from "../Objects/Effects/ToothExplode";
import Specter from "../Objects/src/Enemy/Specter";
import PileOfFrost from "../Objects/src/Piles/PileOfFrost";
import PileOfStorm from "../Objects/src/Piles/PileOfStorm";

export default class CircleOfGhostWarriors{
    map: any
    constructor(){
        this.map = [
            {
                time: 1200,
                action: (level: Level) => {
                    this.createGhost(level)
                }
            },
            {
                time: 2400,
                action: (level: Level) => {
                    this.createGhost(level)
                }
            },
            {
                time: 3600,
                action: (level: Level) => {
                    this.createGhost(level)
                }
            },
            {
                time: 4800,
                action: (level: Level) => {
                    this.createGhost(level)
                }
            },
             {
                time: 6000,
                action: (level: Level) => {
                    this.createGhost(level)
                }
            },
             {
                time: 7200,
                action: (level: Level) => {
                    this.createGhost(level)
                }
            },
             {
                time: 8400,
                action: (level: Level) => {
                    this.createGhost(level)
                }
            },
            {
                time: 10000,
                action(level: Level){
                    let p = level.players[0]
                    p.pressed['d'] = false
                    p.getState()
                   
                    setTimeout(() => {
                         let pile = new PileOfStorm(level)
                         pile.setCastState = () => {
                        
                            pile.state = 'cast'
                            pile.is_attacking = true
                            pile.stateAct = this.castAct
                            pile.action_time = 600

                            setTimeout(() => {
                                let x = p.x
                                let y = p.y
                                let distance = 5
                                let count = 5
                        
                                let zones = 6.28 / count
                        
                                for(let i = 1; i <= count; i++){
                                    let min_a = (i - 1) * zones
                                    let max_a = i * zones
                        
                                    let angle = min_a
                                    let e = new LightningBoltEffect(level)
                                    e.x = x + (Math.sin(angle) * distance)
                                    e.y = y + (Math.cos(angle) * distance)
                            
                                    level.effects.push(e)
                                    p.setZap(20000)
                                }
                            }, 600)

                            pile.cancelAct = () => {
                                pile.action = false
                                pile.is_attacking = false
                                pile.hit = false
                            }

                            pile.setTimerToGetState(600)
                        }
                         pile.frequency = 100
                         pile.spawn_time = 500
                        pile.x = p.x + 8
                        pile.y = p.y

                        level.enemies.push(pile)
                    }, 1500)
                }
            }
        ]
    }

    createGhost(level: Level){
        let player = level.players[0]
                
        let ghost = new Specter(level)
        ghost.x = player.x
        ghost.y = player.y + 5

        let ghost2 = new Specter(level)
        ghost2.x = player.x
        ghost2.y = player.y - 5

        ghost.idleAct = () => {

        }
        ghost2.idleAct = () => {

        }
        level.enemies.push(ghost)
        level.enemies.push(ghost2)

        setTimeout(() => {
            ghost.castAct = () => {

            }
            ghost.setCastState()

            ghost2.castAct = () => {

            }
            ghost2.setCastState()

            setTimeout(() => {
                let x = ghost.x
                let y = ghost.y
                let distance = 5
                let count = 5
        
                let zones = 6.28 / count
        
                for(let i = 1; i <= count; i++){
                    let min_a = (i - 1) * zones
                    let max_a = i * zones
        
                    let angle = min_a
                    let e = new ToothExplode(level)
                    e.x = x + (Math.sin(angle) * distance)
                    e.y = y + (Math.cos(angle) * distance)
            
                    level.effects.push(e)
                }

                level.deleted.push(ghost.id)
                level.enemies = level.enemies.filter(elem => elem.id != ghost.id)

                let x2 = ghost2.x
                let y2 = ghost2.y

        
                for(let i = 1; i <= count; i++){
                    let min_a = (i - 1) * zones
                    let max_a = i * zones
        
                    let angle = min_a
                    let e = new ToothExplode(level)
                    e.x = x2 + (Math.sin(angle) * distance)
                    e.y = y2 + (Math.cos(angle) * distance)
            
                    level.effects.push(e)
                }

                level.deleted.push(ghost.id)
                level.enemies = level.enemies.filter(elem => elem.id != ghost.id)

                level.deleted.push(ghost2.id)
                level.enemies = level.enemies.filter(elem => elem.id != ghost2.id)
            }, 1400)
        }, 1800)
    }

    start(level: Level){
        level.players.forEach((elem) => {
            elem.x = 20
            elem.y = 60
            elem.light_r = 28
            elem.can_move_by_player = true
            elem.pressed['d'] = true
            elem.move_speed = 0.1
            elem.setLastInputs = () => {
                return
            }
        })
    }

    checkTime(level: Level){
        let time_elapsed = level.time - level.started
        console.log(time_elapsed)
        let next_action = this.map[0]

        if(next_action && next_action.time <= time_elapsed){
            next_action.action(level)
            this.map.shift()
        }
    }

}