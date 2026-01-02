import Quake from "../../Abilities/Swordman/Quake";
import Func from "../../Func";
import Level from "../../Level";
import Weakness from "../../Status/Weakness";
import Effect from "../Effects/Effects";
import QuakeEffect from "../Effects/Quake";
import Character from "../src/Character";

export default class QuakeManager extends Effect{

    stage: number = 0
    start: number = 0
    player_was_hilted: boolean = false
    max_stages: number = 0

    constructor(level: Level, private player: Character, private ability: Quake){
        super(level)
        this.max_stages = player.life_status
    }

    act(time: number){
        if(this.stage >= this.max_stages){
            this.delete()
            return
        }
        else if(time - this.start >= 300){
            this.start = time
            let second = this.player.getSecondResource()
            let enemies = this.player.level.enemies
            let players = this.player.level.players

            if (this.ability.selfcare || this.player_was_hilted) {
                players = players.filter(elem => elem != this.player)
            }
            else {
                players = players.filter(elem => elem != this.player)

                this.player.chance_to_avoid_damage_state += 100
                this.player.takeDamage(this.player, {})
                this.player.chance_to_avoid_damage_state -= 100

                let status = new Weakness(this.player.level.time)
                status.setDuration(this.ability.consequences ? 6000 : 3000)
                this.player.level.setStatus(this.player, status)

                this.player_was_hilted = true
            }

            let targets = enemies.concat(players)

            let add = this.ability.consequences ? 5 : 0
            
            let wave = this.player.getBoxElipse()
            wave.r = 5 + add + (this.stage * 5)
  
            targets.forEach(elem => {
                if (Func.elipseCollision(wave, elem.getBoxElipse())) {
                    let instant_kill = elem != this.player && this.ability.blasted && Func.chance(30 + second)
                    elem.takeDamage(this.player, {
                        explode: this.stage === 0,
                        instant_death: instant_kill,
                    })
                }
            })

            let effect = new QuakeEffect(this.player.level)
            effect.setPoint(this.player.x, this.player.y)

            this.player.level.effects.push(effect)
            
            this.stage ++
        }         
    }
}