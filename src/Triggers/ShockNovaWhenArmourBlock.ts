import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import SmallShockNova from '../Objects/Effects/SmallShockNova'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default class ShockNovaWhenArmourBlock implements ITrigger {
    
    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'shock nova'
    description: string = 'Chance to shock nearby enemies when you block damage by armour'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character, target: Unit) {
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
        targets.forEach(elem => {
            if (
                !elem.is_dead &&
                elem.z < 1 &&
                Func.elipseCollision(wave, elem.getBoxElipse()) &&
                elem != player
            ) {
                let timer = Func.random(1000, 3000)
                elem.setZap(timer)
                if (!was_sound) {
                    player.level.addSound('zap', elem.x, elem.y)
                    was_sound = true
                }
            }
        })
    }
}
