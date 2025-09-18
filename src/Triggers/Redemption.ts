import Func from "../Func";
import ToothExplode from "../Objects/Effects/ToothExplode";
import Character from "../Objects/src/Character";

export default class Redemption {

    chance: number = 7
    cd: number = 3000
    last_trigger_time: number = 0

    constructor(){
        
    }

    trigger(player: Character, target: any){
            console.log(target.id)
        if(!target) return  
        if(player.level.deleted.includes(target.id)) return
        if(player.level.time - this.last_trigger_time < this.cd) return
        if(Func.notChance(this.chance, player.is_lucky)) return
        
        let count = 5
        let zones = 6.28 / count
        let distance = 5

        player.level.deleted.push(target.id)
        player.level.addSound('holy cast', target.x, target.y)
        
        for(let i = 1; i <= count; i++){
            let min_a = (i - 1) * zones
        
            let angle = min_a
            let e = new ToothExplode(player.level)
            e.x = target.x + (Math.sin(angle) * distance)
            e.y = target.y + (Math.cos(angle) * distance)
    
            player.level.effects.push(e)
        }

        player.addLife()
    }
}