import Func from "../../Func";
import { Bone } from "../../Objects/Projectiles/Bone";
import Character from "../../Objects/src/Character";
import Unit from "../../Objects/src/Unit";
import Ignite from "../../Status/Ignite";
import Item from "../Item";
import Forging from "./Forging";

export default class BonesWhenBlock extends Forging{

    value: number = 0
    freq: number = 3000
    last_trigger_time: number = 0


    constructor(item: Item){
        super(item)
        this.max_value = 80
        this.name = 'bones when block'
        this.description = 'gives a chance to realise bones when you block which hurts enemies'
        this.gold_cost = 20
    }

    forge(player: Character){
        if(this.canBeForged() && this.costEnough()){
            if(!player.triggers_on_block.some(elem => elem instanceof BonesWhenBlock)){
                player.triggers_on_block.push(this)
            }

            this.payCost()
            this.value += 10
        }
    }

    getValue(){
        return this.value
    }

    trigger(player: Character, target: Unit){
        if(!target) return
        if(this.item.disabled) return
        if(Func.notChance(this.value, player.is_lucky)) return

        if(player.level.time - this.last_trigger_time >= this.freq){
            this.last_trigger_time = player.level.time
           
            let angle = Func.angle(player.x, player.y, player.y, target.y)

            let proj = new Bone(player.level)
            proj.setAngle(angle - 0.4)
            proj.setPoint(player.x, player.y)
            proj.setOwner(player)

            player.level.projectiles.push(proj)

            let proj2 = new Bone(player.level)
            proj2.setAngle(angle)
            proj2.setPoint(player.x, player.y)
             proj2.setOwner(player)

            player.level.projectiles.push(proj2)

            let proj3 = new Bone(player.level)
            proj3.setAngle(angle + 0.4)
            proj3.setPoint(player.x, player.y)
             proj3.setOwner(player)

            player.level.projectiles.push(proj3)
        }
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}