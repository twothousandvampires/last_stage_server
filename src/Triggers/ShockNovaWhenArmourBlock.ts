
import Func from "../Func";
import SmallShockNova from "../Objects/Effects/SmallShockNova";
import Character from "../Objects/src/Character";
import Unit from "../Objects/src/Unit";

export default class ShockNovaWhenArmourBlock {

    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'shock nova'
    description: string = 'Chance to shock nearby enemies when you block damage by armour'

    trigger(player: Character, target: Unit){
        if(Func.notChance(this.chance, player.is_lucky)) return
        if(player.level.time - this.last_trigger_time >= this.cd){
            this.last_trigger_time = player.level.time

            let e = new SmallShockNova(player.level)

            e.setPoint(player.x, player.y)

            player.level.effects.push(e)

            let enemies = player.level.enemies
            let players = player.level.players

            let targets = enemies.concat(players)
            let wave = player.getBoxElipse()
            wave.r = 12

            player.level.addSound('static', player.x, player.y)

            let was_sound = false
            targets.forEach((elem) => {
                if(!elem.is_dead && elem.z < 1 && Func.elipseCollision(wave, elem.getBoxElipse()) && elem != player){
                    let timer = Func.random(200, 1400)
                    elem.setZap(timer)
                    if(!was_sound){
                        player.level.addSound('zap', elem.x, elem.y)
                        was_sound = true
                    }
                }
            })
        }
    }
}