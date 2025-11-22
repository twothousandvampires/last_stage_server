import Func from "../../Func";
import IUnitState from "../../Interfaces/IUnitState";
import QuakeEffect from "../../Objects/Effects/Quake";
import RocksFromCeil from "../../Objects/Effects/RocksFromCeil";
import Character from "../../Objects/src/Character";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import Weakness from "../../Status/Weakness";
import Ability from "../Ability";
import SwordmanAbility from "./SwordmanAbility";

export default class Quake extends SwordmanAbility implements IUnitState{

    fly_time: number = 400
    impact: boolean
    consequences: boolean
    selfcare: boolean
    start = 0
    z_add = 0.8
    blasted: boolean = false

    constructor(owner: Swordman){
        super(owner)
        this.cost = 7
        this.impact = false
        this.consequences = false
        this.selfcare = false
        this.name = 'quake'
        this.need_to_pay = true
        this.type = Ability.TYPE_CUSTOM
        this.mastery_chance = 75
        this.cd = 6000
    }

    enter(player: Character){
        player.prepareToAction()
        player.state = 'jump'
        player.chance_to_avoid_damage_state += 100
        player.addMoveSpeedPenalty(-50)

        this.start = player.level.time
        player.can_block = false
    }

    exit(player: Character){
        player.chance_to_avoid_damage_state -= 100
        player.addMoveSpeedPenalty(50)
        this.impact = false
        this.z_add = 0.5

        player.z = 0
        player.can_block = true
    }

    update(player: Character){
        if(this.impact){
            let second = player.getSecondResource()
            let enemies = player.level.enemies
            let players = player.level.players
            
            if(this.selfcare){
                players = players.filter(elem => elem != player)
            }
              
            let targets = enemies.concat(players)

            let hited: any = []
            let add =  this.consequences ? 7 : 0
                
            add += second

            let first_wave = player.getBoxElipse()
            first_wave.r = 5 + add

            let second_wave = player.getBoxElipse()
            second_wave.r = 8 + add

            let third_wave = player.getBoxElipse()
            third_wave.r = 11 + add
            
            targets.forEach((elem) => {
                if(Func.elipseCollision(first_wave, elem.getBoxElipse())){
                    hited.push(elem)
                    let instant_kill = elem != player && this.blasted && Func.chance(20)
                    elem.takeDamage(player, {
                        explode: true,
                        instant_death: instant_kill
                    })
                }
            })

            targets.forEach((elem) => {
                if(!hited.includes(elem) && Func.elipseCollision(second_wave, elem.getBoxElipse())){
                    hited.push(elem)
                    elem.setStun(4000)
                }
            })

            targets.forEach((elem) => {
                if(!hited.includes(elem) && Func.elipseCollision(third_wave, elem.getBoxElipse())){
                    elem.addMoveSpeedPenalty(-60)
                    setTimeout(() => {
                        elem.addMoveSpeedPenalty(60)
                    }, 5000)
                }
            })

            let effect = new QuakeEffect(player.level)
            effect.setPoint(player.x, player.y)
    
            player.level.effects.push(effect)

            let effect2 = new RocksFromCeil(player.level)
            effect2.setPoint(player.x, player.y)

            player.level.effects.push(effect2)
            let status = new Weakness(player.level.time)
            status.setDuration(this.consequences ? 6000 : 3000)
            
            player.level.setStatus(player, status)

            this.afterUse()
            player.getState() 
        }
        else{
            let delta = player.level.time - this.start

            if(delta >= this.fly_time * 2){
                this.impact = true
                return
            }
            let dir = delta >= 400
            if(dir){
                player.z -= this.z_add
                this.z_add += 0.05
            }
            else {
                player.z += this.z_add
                this.z_add -= 0.05
            }
        }
    }
}