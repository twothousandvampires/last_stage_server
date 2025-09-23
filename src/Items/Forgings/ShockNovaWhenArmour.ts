import Func from "../../Func";
import SmallShockNova from "../../Objects/Effects/SmallShockNova";
import Character from "../../Objects/src/Character";
import Unit from "../../Objects/src/Unit";
import Item from "../Item";
import Forging from "./Forging";

export default class ShockNovaWhenArmour extends Forging{

    value: number = 0
    freq: number = 3000
    last_trigger_time: number = 0


    constructor(item: Item){
        super(item)
        this.max_value = 80
        this.name = 'shock nova when armour'
        this.description = 'chance to shock nearby enemies when you block damage by armour'
        this.gold_cost = 20
    }

    forge(player: Character){
        if(this.canBeForged() && this.costEnough()){
            if(!player.block_with_armour_triggers.some(elem => elem instanceof ShockNovaWhenArmour)){
                player.block_with_armour_triggers.push(this)
            }

            this.payCost()
            this.value += 10
        }
    }

    getValue(){
        return this.value
    }

    trigger(player: Character, target: Unit){
        if(this.item.disabled) return
        
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

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}